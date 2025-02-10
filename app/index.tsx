import { View, Button, Text, StyleSheet, StatusBar, Image, Animated, TouchableOpacity, ImageBackground } from "react-native";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../lib/context/AuthContext";
import { useTheme } from "@/lib/hooks/useTheme";
import SettingsScreen from "@/components/screens/SettingsScreen";
import { useEffect, useRef } from "react"

export default function AuthScreen() {
  const { user, signIn, signOut } = useAuth();
  const styles = createStyles();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);


  return (
    <ImageBackground 
    source={require("@/assets/images/appBg.png")} 
    style={styles.background}
    resizeMode="cover"
  >
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/Small Bites.png")} style={styles.logo} />
        <Text style={styles.title}>Welcome to Small Bites</Text>
        <Text style={styles.subtitle}>Your Campus Food Delivery</Text>
      </View>

        <View style={styles.buttonContainer}>
      <GoogleSignInButton onPress={signIn} />
      {/* {user ? <Text style={styles.text}>Welcome, {user.user.name}</Text> : null}
      {user ? <Button title="Sign Out" onPress={signOut} /> : null} */}
      </View>
      <TouchableOpacity style={styles.themeButton}>
      <SettingsScreen />
      </TouchableOpacity>
      </Animated.View>
      
    </ImageBackground>
  );
  
}

const createStyles = () => {
  const { colorScheme, theme } = useTheme();
  return StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    container: {
      width: "90%",
      alignItems: "center",
      padding: 20,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      alignItems: "center",
      marginBottom: 30,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 15,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
    },
    buttonContainer: {
      width: "80%",
      marginTop: 20,
    },
    themeButton: {
      position: "absolute",
      top: 30,  
      right: 20, 
      width: 30, 
      height: 30, 
      backgroundColor: "transparent", 
      borderRadius: 55, 
      justifyContent: "center", 
      alignItems: "center", 
      borderWidth: 1, 
    },
  });
}
