
import React from 'react';
import { MessageSquare } from 'lucide-react';

const RestaurantHeader = () => {
  return (
    <div className="bg-gradient-to-r from-restaurant-primary to-restaurant-secondary text-white p-4 md:p-6 rounded-xl mb-6 shadow-md">
      <div className="flex items-center">
        <div className="bg-white rounded-full p-2 mr-3">
          <MessageSquare className="h-6 w-6 text-restaurant-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">ChidieBot</h1>
          <p className="text-white/80 text-sm">AI-powered food ordering assistant</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
