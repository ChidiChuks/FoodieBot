
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import CartItem from './CartItem';
import { FoodItemType } from './FoodItem';
import { useToast } from '@/components/ui/use-toast';

type CartItemType = {
  item: FoodItemType;
  quantity: number;
};

type CartProps = {
  items: CartItemType[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onCheckout: () => void;
};

const Cart = ({ items, onIncrease, onDecrease, onCheckout }: CartProps) => {
  const { toast } = useToast();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }
    onCheckout();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-restaurant-muted/50 p-4">
      <div className="flex items-center mb-4">
        <ShoppingCart className="text-restaurant-primary mr-2" size={20} />
        <h2 className="text-xl font-semibold">Your Order</h2>
        <span className="bg-restaurant-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs ml-2">
          {totalItems}
        </span>
      </div>

      <div className="max-h-[300px] overflow-y-auto chat-scrollbar mb-4">
        {items.length > 0 ? (
          items.map((cartItem) => (
            <CartItem
              key={cartItem.item.id}
              item={cartItem.item}
              quantity={cartItem.quantity}
              onIncrease={() => onIncrease(cartItem.item.id)}
              onDecrease={() => onDecrease(cartItem.item.id)}
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            Your cart is empty
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 py-3">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">${items.length > 0 ? '3.99' : '0.00'}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${items.length > 0 ? (subtotal + 3.99).toFixed(2) : '0.00'}</span>
        </div>
      </div>

      <Button
        className="w-full bg-restaurant-primary hover:bg-restaurant-secondary mt-4"
        onClick={handleCheckout}
      >
        Checkout
      </Button>
    </div>
  );
};

export default Cart;
