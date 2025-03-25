import React, { createContext, useContext, useState } from 'react';

type OrderStatus = 'pending' | 'preparing' | 'ready';

interface Order {
  id: string;
  name: string;
  status: OrderStatus;
  items: Array<{ name: string; quantity: number }>;
}

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '1', 
      name: 'Order #143021', 
      status: 'pending',
      items: [
        { name: 'Burger', quantity: 2 },
        { name: 'Fries', quantity: 1 },
        { name: 'Soda', quantity: 2 }
      ]
    },
    { 
      id: '2', 
      name: 'Order #142501', 
      status: 'preparing',
      items: [
        { name: 'Pizza', quantity: 1 },
        { name: 'Coke', quantity: 2 }
      ]
    },
    { 
      id: '3', 
      name: 'Order #142009', 
      status: 'ready',
      items: [
        { name: 'Sandwich', quantity: 1 }
      ]
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}; 