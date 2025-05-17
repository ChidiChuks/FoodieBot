
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export type FoodItemType = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type FoodItemProps = {
  item: FoodItemType;
  onAddToCart: (item: FoodItemType) => void;
};

const FoodItem = ({ item, onAddToCart }: FoodItemProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full border border-restaurant-muted/50 hover:shadow-lg transition-shadow">
      <div className="relative h-40">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-2 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-medium text-restaurant-dark">${item.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            onClick={() => onAddToCart(item)}
            className="bg-restaurant-primary hover:bg-restaurant-secondary text-white"
          >
            <PlusIcon size={16} className="mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
