import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import CanteenMenuScreen from '../../components/screens/CanteenMenuScreen';

export default function CanteenPage() {
  const { id, name } = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <CanteenMenuScreen 
        canteenId={id as string} 
        canteenName={name as string} 
      />
    </>
  );
} 