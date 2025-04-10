import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import CanteenMenuScreen from '@/components/screens/CanteenMenuScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CanteenPage() {
  const { id, name } = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CanteenMenuScreen
        canteenId={id as string}
        canteenName={name as string}
      />
    </SafeAreaView>
  );
} 