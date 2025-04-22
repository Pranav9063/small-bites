import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CanteenMenuScreen from '@/components/screens/CanteenMenuScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CanteenPage() {
  const { id, canteenName } = useLocalSearchParams();
  console.log('Cart Canteen ID:', id);
  console.log('Cart Canteen Name:', canteenName);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CanteenMenuScreen
        canteenId={id as string}
        canteenName={canteenName as string}
      />
    </SafeAreaView>
  );
} 