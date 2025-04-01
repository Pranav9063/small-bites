import React from 'react';
import { Stack } from 'expo-router';
import ExpensesScreen from '@/components/screens/ExpensesScreen';

export default function ExpensePage() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <ExpensesScreen />
    </>
  );
} 