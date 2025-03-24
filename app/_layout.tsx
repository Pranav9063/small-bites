import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureOptions } from "@/constants/Config";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/lib/context/AuthContext";
import { useTheme } from "react-native-paper";
import { PaperProvider } from "react-native-paper";
import mytheme from "@/constants/Theme";
import { CartProvider } from '../lib/context/CartContext';

function RootContent() {
  const [initializing, setInitializing] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  // console.log(segments);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(() => {
      setInitializing(false);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    GoogleSignin.configure(configureOptions);
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuth = segments[0] === 'auth';
    // console.log(user);
    // console.log(inAuth);

    if (!user && !inAuth) {
      router.replace('/auth/login');
    }
  }, [user, initializing]);


  if (initializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="user/canteen/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="canteen/(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={mytheme}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <RootContent />
            <ThemedStatusBar />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

function ThemedStatusBar() {
  const theme = useTheme();
  return <StatusBar backgroundColor={theme.colors.background} style={theme.colors.background === 'dark' ? 'light' : 'dark'} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
