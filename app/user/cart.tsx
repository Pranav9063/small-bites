import React from 'react';
import { Stack } from 'expo-router';
import CartScreen from '../../components/screens/CartScreen';

export default function CartPage() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <CartScreen />
    </>
  );
} 