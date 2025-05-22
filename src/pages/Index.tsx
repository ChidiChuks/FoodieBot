import React, { useState, useEffect, useRef } from 'react';
// import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatOpenAI } from '@langchain/openai';
// import { HumanMessage, SystemMessage, AIMessage } from 'langchain/schema';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { createClient } from '@supabase/supabase-js';
import { FoodItemType } from '@/components/FoodItem';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SuggestionChips from '@/components/SuggestionChips';
import Cart from '@/components/Cart';
import MenuSection from '@/components/MenuSection';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import RestaurantHeader from '@/components/RestaurantHeader';
import { getMenuByCategory } from '@/data/foodMenu';
import {
  getCurrentTime,
  getWelcomeMessages,
  getInitialSuggestions,
  generateSuggestions,
} from '@/utils/chatUtils';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Message = {
  message: string;
  isUser: boolean;
  timestamp: string;
};

type CartItemType = {
  item: FoodItemType;
  quantity: number;
};

type OrderStatus = 'none' | 'placed' | 'confirmed' | 'preparing' | 'delivering' | 'delivered';

// Replace the existing Supabase client initialization
const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Replace the existing ChatOpenAI initialization
const chatModel = new ChatOpenAI({
  temperature: 0.7,
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY
});

// Add this after supabaseClient initialization
supabaseClient
  .from('chat_history')
  .select('count')
  .limit(1)
  .then(response => {
    if (response.error) {
      console.error('Supabase connection error:', response.error);
    } else {
      console.log('Supabase connection successful');
    }
  });

// After chatModel initialization
if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  console.error('Missing OpenAI API key');
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(getWelcomeMessages());
  const [suggestions, setSuggestions] = useState<string[]>(getInitialSuggestions());
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('none');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const menuSections = getMenuByCategory();
  const { toast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (orderStatus === 'confirmed') {
      timeout = setTimeout(() => {
        setOrderStatus('preparing');
        addSystemMessage("Your food is now being prepared by our chefs. It won't take long!");
      }, 5000);
    } else if (orderStatus === 'preparing') {
      timeout = setTimeout(() => {
        setOrderStatus('delivering');
        addSystemMessage("Your order is on the way! You can track its progress in real-time.");
      }, 8000);
    } else if (orderStatus === 'delivering') {
      timeout = setTimeout(() => {
        setOrderStatus('delivered');
        addSystemMessage("Your order has been delivered! Enjoy your meal. 😊");
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [orderStatus]);

  const handleSendMessage = async (message: string) => {
    const newUserMessage = {
      message,
      isUser: true,
      timestamp: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const messageHistory = messages.map(msg =>
        msg.isUser ? new HumanMessage(msg.message) : new AIMessage(msg.message)
      );
      const systemMessage = new SystemMessage(
        "You are a helpful AI assistant for a restaurant ordering system. Help users with menu items, recommendations, and placing orders."
      );

      const response = await chatModel.call([
        systemMessage,
        ...messageHistory,
        new HumanMessage(message)
      ]);

      await supabaseClient
        .from('chat_history')
        .insert([{
          user_message: message,
          ai_response: response.content,
          timestamp: new Date().toISOString()
        }]);

      const botResponse = {
        message: typeof response.content === 'string' ? response.content : JSON.stringify(response.content),
        isUser: false,
        timestamp: getCurrentTime(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

      const responseText = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      const newSuggestions = generateSuggestions(responseText);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const addSystemMessage = (message: string) => {
    const systemMessage = {
      message,
      isUser: false,
      timestamp: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  };

  const handleAddToCart = (item: FoodItemType) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.item.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        toast({
          title: "Item added",
          description: `${item.name} added to your cart`,
        });
        return [...prevItems, { item, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const now = new Date();
    const deliveryMinutes = Math.floor(Math.random() * 15) + 30;
    const deliveryTime = new Date(now.getTime() + deliveryMinutes * 60000);
    const formattedTime = deliveryTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });

    setOrderStatus('confirmed');
    setEstimatedDeliveryTime(formattedTime);

    const orderDetails = cartItems
      .map((item) => `${item.quantity}x ${item.item.name}`)
      .join(", ");

    const total = cartItems.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
      0
    ) + 3.99;

    addSystemMessage(
      `Thank you for your order! You've ordered: ${orderDetails}. Total: $${total.toFixed(2)}. Your order will arrive by ${formattedTime}.`
    );

    try {
      await supabaseClient
        .from('orders')
        .insert([{
          items: cartItems,
          total: total,
          status: orderStatus,
          estimated_delivery: formattedTime,
          created_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive"
      });
    }

    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <RestaurantHeader />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Tabs defaultValue="chat" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat with AI</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="mt-4">
                {/* Chat section */}
                <div className="bg-white rounded-xl shadow-md border p-4 h-[600px] overflow-y-auto">
                    {messages.map((msg, index) => (
                      <ChatMessage
                        key={index}
                        message={msg.message}
                        isUser={msg.isUser}
                        timestamp={msg.timestamp}
                      />
                    ))}
                  <div ref={chatEndRef} />
                </div>
                <SuggestionChips suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
                <ChatInput onSendMessage={handleSendMessage} />
              </TabsContent>
              <TabsContent value="menu" className="mt-4">
                {menuSections.map((section, index) => (
                  <MenuSection
                    key={index}
                    title={section.category}
                    items={section.items}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:col-span-4 space-y-6">
            <OrderStatusTracker status={orderStatus} estimatedTime={estimatedDeliveryTime} />
            <Cart
              items={cartItems}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
