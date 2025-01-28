import { Stack } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureOptions } from "@/config/config";
import { useEffect } from "react";

export default function RootLayout() {

  useEffect(() => {
    GoogleSignin.configure(configureOptions);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
