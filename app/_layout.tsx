import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureOptions } from "@/constants/Config";
import { useContext, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { ThemeContext, ThemeProvider } from "@/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootContent() {
  const [initialising, setInitialising] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('ThemeContext is undefined, make sure you are using ThemeProvider');
  }
  const { colorScheme, theme } = context;

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
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar backgroundColor={theme.background} style={colorScheme == 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <ThemeProvider><RootContent /></ThemeProvider>;
}
