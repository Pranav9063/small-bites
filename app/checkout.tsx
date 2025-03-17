import React from 'react';
import { Stack } from 'expo-router';
import CheckoutScreen from '../components/screens/CheckoutScreen';

export default function CheckoutPage() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <CheckoutScreen />
    </>
  );
} 