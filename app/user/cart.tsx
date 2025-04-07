import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import CartScreen from '../../components/screens/CartScreen';

export default function CartPage() {

  const { id, name } = useLocalSearchParams() as { id: string, name: string };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <CartScreen id={id} name={name} />
    </>
  );
} 