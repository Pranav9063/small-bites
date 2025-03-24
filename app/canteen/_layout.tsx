import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="menu" options={{headerShown: false}}/>
      <Stack.Screen name="history" options={{headerShown: false}}/>
      <Stack.Screen name="updateMenu" options={{headerShown: false}}/>
      <Stack.Screen name="OrderDet" options={{headerShown: false}}/>
      <Stack.Screen name="addItem" options={{headerShown: false}}/>
      <Stack.Screen name="orders" options={{headerShown: true, title: "Orders" }}/>
      <Stack.Screen name="orders/index" options={{headerShown: true, title: "Orders" }}/>
    </Stack>
  );
}