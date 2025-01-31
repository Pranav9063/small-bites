import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureOptions } from "@/config/config";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {

  const [initialising, setInitialising] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    // console.log("onAuthStateChanged", user);
    setUser(user);
    if (initialising) setInitialising(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    GoogleSignin.configure(configureOptions);
  }, []);

  useEffect(() => {
    if (initialising) return;

    const inAuth = segments[0] === '(auth)';
    console.log("inAuth", inAuth);
    if (user && !inAuth) router.replace('/(auth)/home');
    else if (!user && inAuth) router.replace('/');
  }, [user, initialising]);

  if (initialising) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  };

  return (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  </Stack>
  );
}
