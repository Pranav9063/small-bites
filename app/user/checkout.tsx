import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import CheckoutScreen from '@/components/screens/CheckoutScreen';

export default function CheckoutPage() {
  const { id, name } = useLocalSearchParams() as { id: string, name: string };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <CheckoutScreen canteenId={id} canteenName={name} />
    </>
  );
} 