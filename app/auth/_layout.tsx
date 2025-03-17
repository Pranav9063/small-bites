import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="canteen" />
      {/* <Stack.Screen name="sign-up" /> */}
    </Stack>
  );
}