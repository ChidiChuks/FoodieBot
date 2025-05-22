import { format } from 'date-fns';
import { foodMenu } from '@/data/foodMenu';
import { conversationChain } from './llmChain';
import { generateSuggestions as gs, formatMenuItems, checkDietary } from './chatUtils.helpers';

// Time formatting utility
export const getCurrentTime = () => format(new Date(), 'h:mm a');

// Welcome messages with timestamp
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

// Default conversation starters
export const getInitialSuggestions = () => [
  "Show me the menu",
  "What's popular?",
  "Do you have vegetarian options?",
  "Start a new order"
];

// Main response generator with hybrid approach
export const generateResponse = async (userInput: string) => {
  const input = userInput.toLowerCase();
  
  // --- Instant Rule-based Responses ---
  // Menu category queries
  if (/menu|food|eat|order/i.test(input)) {
    return "We offer burgers, pizzas, salads, sides and drinks. What would you like?";
  }

  // Specific category handling
  if (input.includes('burger')) {
    const burgers = foodMenu.filter(item => item.category === 'burgers');
    return `Our burgers: ${formatMenuItems(burgers)}. Try our ${burgers[0]?.name}!`;
  }
  
  if (input.includes('pizza')) {
    const pizzas = foodMenu.filter(item => item.category === 'pizzas');
    return `Our pizzas: ${formatMenuItems(pizzas)}. Today's special: ${pizzas[0]?.name}!`;
  }

  // Dietary preferences
  const dietaryFlag = checkDietary(input);
  if (dietaryFlag) {
    const items = foodMenu.filter(item => item[dietaryFlag]);
    return items.length 
      ? `${dietaryFlag.replace('is', '')} options: ${formatMenuItems(items)}`
      : "We're updating our ${dietaryFlag} menu. Check back soon!";
  }

  // Popular items
  if (/popular|recommend|best/i.test(input)) {
    const popular = foodMenu.filter(item => item.isPopular);
    return popular.length
      ? `Try these favorites: ${formatMenuItems(popular)}`
      : "Our Classic Cheeseburger and Pepperoni Pizza are customer favorites!";
  }

  // Delivery queries
  if (/delivery|time|when/i.test(input)) {
    return "Delivery takes 30-45 mins. Free for orders over $25!";
  }

  // --- LLM Fallback for Complex Queries ---
  try {
    const { response } = await conversationChain.call({ 
      input: userInput,
      context: {
        currentTime: getCurrentTime(),
        menuCategories: [...new Set(foodMenu.map(item => item.category))],
        dailySpecial: foodMenu.find(item => item.isSpecial)?.name || 'Pepperoni Pizza'
      }
    });
    return response;
  } catch (error) {
    console.error('LLM Error:', error);
    return "I'm having trouble answering that. Ask about our menu or current specials!";
  }
};

// Context-aware suggestions
export const generateSuggestions = (lastMessage: string) => {
  const message = lastMessage.toLowerCase();
  
  // Quick return for common scenarios
  if (message.includes('added to cart')) return ["Checkout now", "Add more items"];
  if (message.includes('order confirmed')) return ["Track order", "Reorder"];
  
  // Delegate to helpers for complex logic
  return gs(message);
};