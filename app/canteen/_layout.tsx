import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="history" />
      <Stack.Screen name="updateMenu" />
      <Stack.Screen name="OrderDet" />
      <Stack.Screen name="orders" />
    </Stack>
  );
}