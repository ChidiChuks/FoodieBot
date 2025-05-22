import { supabase } from './supabaseClient';
import { foodMenu } from '@/data/foodMenu';

type OrderItem = { id: string; quantity: number };
type OrderResult = { orderId: string; eta: string };

export const getMenuItems = (category?: string) => {
  return category 
    ? foodMenu.filter(i => i.category === category) 
    : foodMenu;
};

export const addOrder = async (order: { items: OrderItem[] }): Promise<OrderResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id || 'guest',
      items: order.items,
      status: 'pending'
    })
    .select('id')
    .single();

  if (error) throw new Error('Order failed: ' + error.message);
  return { orderId: data.id, eta: '30-45 minutes' };
};