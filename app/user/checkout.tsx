import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import CheckoutScreen from '@/components/screens/CheckoutScreen';

export default function CheckoutPage() {
  const {canteenId, canteenName} = useLocalSearchParams() as {canteenId:string, canteenName:string};
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <CheckoutScreen canteenId={canteenId} canteenName={canteenName}/>
    </>
  );
} 