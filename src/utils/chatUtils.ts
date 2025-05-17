
// Simple response generator for the AI chatbot
// In a real app, this would be connected to an actual AI service

import { format } from 'date-fns';
import { foodMenu } from '@/data/foodMenu';

// Get current formatted time
export const getCurrentTime = () => {
  return format(new Date(), 'h:mm a');
};

// Welcome messages from the chatbot
export const getWelcomeMessages = () => [
  {
    message: "👋 Hello! I'm FoodieBot, your personal food ordering assistant. What can I help you with today?",
    isUser: false,
    timestamp: getCurrentTime(),
  },
  {
    message: "You can ask me about our menu, make an order, or check your order status.",
    isUser: false,
    timestamp: getCurrentTime(),
  }
];

// Initial suggestions for users
export const getInitialSuggestions = () => [
  "Show me the menu",
  "What's popular?",
  "Do you have vegetarian options?",
  "Start a new order"
];

// Generate chatbot responses based on user input
export const generateResponse = (userInput: string) => {
  const input = userInput.toLowerCase();
  
  // Check for menu related queries
  if (input.includes('menu') || input.includes('food') || input.includes('eat')) {
    return "I'd be happy to show you our menu! We have burgers, pizzas, salads, sides, and drinks. What are you in the mood for?";
  }
  
  // Check for specific menu categories
  if (input.includes('burger')) {
    const burgers = foodMenu
      .filter(item => item.category === 'burgers')
      .map(item => item.name)
      .join(', ');
    return `Our burger selection includes: ${burgers}. Would you like to add any to your order?`;
  }
  
  if (input.includes('pizza')) {
    const pizzas = foodMenu
      .filter(item => item.category === 'pizzas')
      .map(item => item.name)
      .join(', ');
    return `Our pizza menu has: ${pizzas}. Would you like to order one?`;
  }
  
  if (input.includes('salad')) {
    const salads = foodMenu
      .filter(item => item.category === 'salads')
      .map(item => item.name)
      .join(', ');
    return `For salads, we offer: ${salads}. They're fresh and delicious!`;
  }
  
  // Check for order related queries
  if (input.includes('order') || input.includes('checkout')) {
    return "Great! To place an order, you can select items from our menu and add them to your cart. When you're ready, click the Checkout button.";
  }
  
  // Check for vegetarian options
  if (input.includes('vegetarian') || input.includes('vegan')) {
    return "Yes! We have vegetarian options. Our Veggie Burger and Vegetable Supreme Pizza are very popular. Would you like to see all vegetarian items?";
  }
  
  // Check for popular items
  if (input.includes('popular') || input.includes('recommend') || input.includes('best')) {
    return "Our most popular items are the Classic Cheeseburger, Pepperoni Pizza, and Caesar Salad. Would you like to add any of these to your order?";
  }
  
  // Check for delivery time
  if (input.includes('delivery') || input.includes('time') || input.includes('when')) {
    return "Delivery usually takes 30-45 minutes, depending on your location and current demand. Once you place your order, you'll be able to track its status.";
  }
  
  // Default response
  return "I'm here to help with your food order. You can ask about our menu, place an order, or check your order status. What would you like to do?";
};

// Generate follow-up suggestions based on context
export const generateSuggestions = (lastMessage: string) => {
  const message = lastMessage.toLowerCase();
  
  if (message.includes('menu') || message.includes('food')) {
    return ["Show me burgers", "Pizza options", "Vegetarian items", "What drinks do you have?"];
  }
  
  if (message.includes('burger') || message.includes('pizza') || message.includes('salad')) {
    return ["Add to cart", "Show me sides", "Any drinks?", "Tell me more"];
  }
  
  if (message.includes('order') || message.includes('delivery')) {
    return ["Track my order", "Modify my order", "Delivery time?", "Payment options"];
  }
  
  return ["Show me the menu", "What's popular?", "Delivery time?", "Start new order"];
};
