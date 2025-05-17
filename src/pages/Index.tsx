
import React, { useState, useEffect, useRef } from 'react';
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
  generateResponse,
  generateSuggestions,
} from '@/utils/chatUtils';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin } from 'lucide-react';

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

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(getWelcomeMessages());
  const [suggestions, setSuggestions] = useState<string[]>(getInitialSuggestions());
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('none');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const menuSections = getMenuByCategory();
  const { toast } = useToast();

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate order progress for demo purposes
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (orderStatus === 'confirmed') {
      // Move to preparing after 5 seconds
      timeout = setTimeout(() => {
        setOrderStatus('preparing');
        addSystemMessage("Your food is now being prepared by our chefs. It won't take long!");
      }, 5000);
    } else if (orderStatus === 'preparing') {
      // Move to delivering after 8 seconds
      timeout = setTimeout(() => {
        setOrderStatus('delivering');
        addSystemMessage("Your order is on the way! You can track its progress in real-time.");
      }, 8000);
    } else if (orderStatus === 'delivering') {
      // Move to delivered after 10 seconds
      timeout = setTimeout(() => {
        setOrderStatus('delivered');
        addSystemMessage("Your order has been delivered! Enjoy your meal. 😊");
      }, 10000);
    }
    
    return () => clearTimeout(timeout);
  }, [orderStatus]);

  const handleSendMessage = (message: string) => {
    // Add user message
    const newUserMessage = {
      message,
      isUser: true,
      timestamp: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
    // Generate and add AI response after a short delay to simulate thinking
    setTimeout(() => {
      const response = generateResponse(message);
      const botResponse = {
        message: response,
        isUser: false,
        timestamp: getCurrentTime(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      // Generate new suggestions based on the response
      const newSuggestions = generateSuggestions(response);
      setSuggestions(newSuggestions);
    }, 500);
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

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Calculate a delivery time 30-45 minutes from now
    const now = new Date();
    const deliveryMinutes = Math.floor(Math.random() * 15) + 30; // Random between 30-45 min
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
    ) + 3.99; // Add delivery fee
    
    addSystemMessage(
      `Thank you for your order! You've ordered: ${orderDetails}. Total: $${total.toFixed(2)}. Your order will arrive by ${formattedTime}.`
    );
    
    // Clear cart after checkout
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <RestaurantHeader />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left side - Chat and Menu */}
          <div className="md:col-span-8">
            <Tabs defaultValue="chat" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat with AI</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                {/* Chat section */}
                <div className="bg-white rounded-xl shadow-md border border-restaurant-muted/50 p-4">
                  <div className="h-[400px] overflow-y-auto chat-scrollbar mb-4 p-2">
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
                  
                  <SuggestionChips
                    suggestions={suggestions}
                    onSuggestionClick={handleSuggestionClick}
                  />
                  
                  <div className="mt-4">
                    <ChatInput onSendMessage={handleSendMessage} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="menu" className="mt-4">
                {/* Menu section */}
                <div className="bg-white rounded-xl shadow-md border border-restaurant-muted/50 p-6">
                  <h2 className="text-3xl font-bold mb-6 text-center text-restaurant-secondary">
                    Our Menu
                  </h2>
                  
                  {menuSections.map((section) => (
                    <MenuSection
                      key={section.category}
                      title={section.category.charAt(0).toUpperCase() + section.category.slice(1)}
                      items={section.items}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Location section */}
            {orderStatus !== 'none' && (
              <div className="bg-white rounded-xl shadow-md border border-restaurant-muted/50 p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="text-restaurant-primary mr-2" />
                  <h2 className="text-xl font-semibold">Delivery Location</h2>
                </div>
                <div className="bg-gray-100 h-[200px] rounded-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Map view would be displayed here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right side - Cart and Order Status */}
          <div className="md:col-span-4 space-y-6">
            <Cart
              items={cartItems}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              onCheckout={handleCheckout}
            />
            
            {orderStatus !== 'none' && (
              <OrderStatusTracker
                currentStage={orderStatus === 'placed' ? 'confirmed' : orderStatus}
                estimatedDeliveryTime={estimatedDeliveryTime}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
