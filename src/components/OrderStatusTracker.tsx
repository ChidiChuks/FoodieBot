
import React from 'react';
import { CheckIcon, Clock, Package, Truck, Utensils } from 'lucide-react';

type OrderStage = 'confirmed' | 'preparing' | 'delivering' | 'delivered';

type OrderStatusTrackerProps = {
  currentStage: OrderStage;
  estimatedDeliveryTime?: string;
};

const OrderStatusTracker = ({ currentStage, estimatedDeliveryTime }: OrderStatusTrackerProps) => {
  const stages: { id: OrderStage; icon: React.ReactNode; label: string }[] = [
    {
      id: 'confirmed',
      icon: <CheckIcon className="h-6 w-6" />,
      label: 'Order Confirmed',
    },
    {
      id: 'preparing',
      icon: <Utensils className="h-6 w-6" />,
      label: 'Preparing',
    },
    {
      id: 'delivering',
      icon: <Truck className="h-6 w-6" />,
      label: 'Out for Delivery',
    },
    {
      id: 'delivered',
      icon: <Package className="h-6 w-6" />,
      label: 'Delivered',
    },
  ];

  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStage);

  return (
    <div className="bg-white rounded-xl shadow-md border border-restaurant-muted/50 p-6">
      <div className="flex items-center mb-6">
        <Clock className="text-restaurant-primary mr-2" />
        <h2 className="text-xl font-semibold">Order Status</h2>
      </div>

      {estimatedDeliveryTime && (
        <div className="mb-6 bg-restaurant-accent p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">Estimated Delivery</p>
          <p className="font-medium text-restaurant-dark">{estimatedDeliveryTime}</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute top-0 left-6 h-full w-0.5 bg-gray-200 -z-10"></div>
        
        {stages.map((stage, index) => {
          const isActive = index <= currentStageIndex;
          const isPulsing = index === currentStageIndex;

          return (
            <div key={stage.id} className="flex items-start mb-6 last:mb-0">
              <div 
                className={`rounded-full p-2 mr-4 ${
                  isPulsing 
                    ? 'bg-restaurant-primary animate-pulse-light' 
                    : isActive 
                      ? 'bg-restaurant-primary' 
                      : 'bg-gray-200'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {stage.icon}
                </div>
              </div>
              <div>
                <h3 className={`font-medium ${isActive ? 'text-restaurant-dark' : 'text-gray-400'}`}>
                  {stage.label}
                </h3>
                {isPulsing && (
                  <p className="text-gray-500 text-sm mt-1">In progress...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
