import { foodMenu } from '@/data/foodMenu';
import { getInitialSuggestions } from './chatUtils';

// Helper for generating category-specific suggestions
const getCategorySuggestions = (category: string) => {
  const items = foodMenu
    .filter(item => item.category === category)
    .slice(0, 3)
    .map(item => item.name);
    
  return [
    ...items,
    `See all ${category}`,
    'Customize order',
    'Dietary options'
  ];
};

// Helper for order-related suggestions
const getOrderSuggestions = () => [
  'Add more items',
  'Special requests',
  'Apply promo code',
  'Checkout now'
];

// For tracking conversation state
export const getConversationContext = () => {
  return {
    lastCategory: '',
    cartItems: [],
    isOrderPending: false
  };
};

// Main suggestion generator (used by generateSuggestions in chatUtils.ts)
export const generateSuggestions = (lastMessage: string) => {
  const message = lastMessage.toLowerCase();

  // Menu category triggers
  if (message.includes('burger')) return getCategorySuggestions('burgers');
  if (message.includes('pizza')) return getCategorySuggestions('pizzas');
  if (message.includes('salad')) return getCategorySuggestions('salads');
  if (message.includes('drink')) return getCategorySuggestions('drinks');
  if (message.includes('side')) return getCategorySuggestions('sides');

  // Order flow triggers
  if (message.includes('order') || message.includes('cart')) {
    return getOrderSuggestions();
  }

  // Dietary preference triggers
  if (message.includes('vegetarian') || message.includes('vegan')) {
    return [
      'Veggie Burger',
      'Margherita Pizza',
      'Greek Salad',
      'See all vegetarian'
    ];
  }

  // Delivery triggers
  if (message.includes('delivery') || message.includes('time')) {
    return [
      'Track my order',
      'Change delivery address',
      'Contact driver',
      'Delivery FAQ'
    ];
  }

  // Default fallback
  return getInitialSuggestions();
};

// Helper for formatting menu items
export const formatMenuItems = (items: typeof foodMenu, limit = 3) => {
  return items
    .slice(0, limit)
    .map(item => `${item.name} ($${item.price})`)
    .join(', ') + (items.length > limit ? `, and ${items.length - limit} more...` : '');
};

// Helper for dietary flags
export const checkDietary = (input: string) => {
  const dietaries = [
    { term: 'vegetarian', flag: 'isVegetarian' },
    { term: 'vegan', flag: 'isVegan' },
    { term: 'gluten', flag: 'isGlutenFree' }
  ];
  
  return dietaries.find(d => 
    input.includes(d.term)
  )?.flag || null;
};