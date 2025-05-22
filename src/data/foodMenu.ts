type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'burgers' | 'pizzas' | 'salads' | 'sides' | 'drinks';
  isVegetarian?: boolean;
  isPopular?: boolean;  // For customer favorites
  isSpecial?: boolean;  // For daily specials
  isVegan?: boolean;    // For vegan filtering
};



// Sample food menu data
export const foodMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500',
    category: 'burgers',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Veggie Burger',
    description: 'Plant-based patty with avocado, lettuce, tomato, and vegan mayo',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=500',
    category: 'burgers',
    isVegetarian: true,
    isVegan: true,
    isPopular: true,
  },
  {
    id: '3',
    name: 'BBQ Bacon Burger',
    description: 'Beef patty with crispy bacon, cheddar, BBQ sauce, and onion rings',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=500',
    category: 'burgers',
    isSpecial: true,
  },
  {
    id: '4',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500',
    category: 'pizzas',
    isVegetarian: true,
    isPopular: true,
  },
  {
    id: '5',
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, and spicy pepperoni slices',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500',
    category: 'pizzas',
  },
  {
    id: '6',
    name: 'Vegetable Supreme Pizza',
    description: 'Loaded with bell peppers, mushrooms, onions, olives, and tomatoes',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=500',
    category: 'pizzas',
    isVegetarian: true,
    isVegan: true,
    isSpecial: true,
  },
  {
    id: '7',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500',
    category: 'salads',
  },
  {
    id: '8',
    name: 'Greek Salad',
    description: 'Fresh cucumbers, tomatoes, olives, feta cheese, and red onions',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1609167830220-7164aa360951?q=80&w=500',
    category: 'salads',
    isVegetarian: true,
    isPopular: true,
  },
  {
    id: '9',
    name: 'French Fries',
    description: 'Crispy golden fries with your choice of dipping sauce',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500',
    category: 'sides',
    isVegan: true,
    isPopular: true,
  },
  {
    id: '10',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings served with dipping sauce',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=500',
    category: 'sides',
    isVegetarian: true,
  },
  {
    id: '11',
    name: 'Chocolate Milkshake',
    description: 'Rich and creamy chocolate milkshake topped with whipped cream',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=500',
    category: 'drinks',
    isPopular: true,
  },
  {
    id: '12',
    name: 'Iced Tea',
    description: 'Refreshing iced tea with lemon slice',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=500',
    category: 'drinks',
    isVegan: true,
  },
];

export const getMenuByCategory = () => {
  const categories = Array.from(new Set(foodMenu.map(item => item.category)));
  // const categories = ['burgers', 'pizzas', 'salads', 'sides', 'drinks'] as const;
  return categories.map(category => {
    return {
      category,
      items: foodMenu.filter(item => item.category === category),
    };
  });
};
