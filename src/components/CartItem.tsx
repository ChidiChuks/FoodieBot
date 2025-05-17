
import React from 'react';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { FoodItemType } from './FoodItem';

type CartItemProps = {
  item: FoodItemType;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const CartItem = ({ item, quantity, onIncrease, onDecrease }: CartItemProps) => {
  return (
    <div className="flex items-center py-3 border-b last:border-b-0 border-gray-100">
      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-3 flex-grow">
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-restaurant-dark font-medium">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full border-restaurant-primary/20"
          onClick={onDecrease}
        >
          <MinusIcon size={14} className="text-restaurant-primary" />
        </Button>
        <span className="mx-2 w-6 text-center">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full border-restaurant-primary/20"
          onClick={onIncrease}
        >
          <PlusIcon size={14} className="text-restaurant-primary" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
