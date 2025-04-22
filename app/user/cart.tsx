import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import CartScreen from '../../components/screens/CartScreen';

export default function CartPage() {

  const { canteenId, canteenName } = useLocalSearchParams() as { canteenId: string, canteenName: string };
  console.log('Cart Canteen ID:', canteenId);
  console.log('Cart Canteen Name:', canteenName);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <CartScreen id={canteenId} name={canteenName} />
    </>
  );
} 