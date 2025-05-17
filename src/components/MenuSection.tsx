
import React from 'react';
import FoodItem, { FoodItemType } from './FoodItem';

type MenuSectionProps = {
  title: string;
  items: FoodItemType[];
  onAddToCart: (item: FoodItemType) => void;
};

const MenuSection = ({ title, items, onAddToCart }: MenuSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-restaurant-secondary">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <FoodItem key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
