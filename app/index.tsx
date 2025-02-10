import { View, Button, Text, StyleSheet, StatusBar, Image } from "react-native";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../lib/context/AuthContext";
import { useTheme } from "@/lib/hooks/useTheme";
import SettingsScreen from "@/components/screens/SettingsScreen";

export default function AuthScreen() {
  const { user, signIn, signOut } = useAuth();
  const styles = createStyles();

  return (
    <View style={styles.container}>
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
      <SettingsScreen />
    </View>
  );
  
}

const createStyles = () => {
  const { colorScheme, theme } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 20,
    },
    header: {
      alignItems: "center",
      marginBottom: 50,
      padding: 20,
      borderRadius: 15,
      backgroundColor: theme.primary,
      elevation: 5, // Shadow effect
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    logo: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 5,
      borderColor: "#fff",
      marginBottom: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.foreground,
      marginBottom: 10,
      textAlign: "center",
      textShadowColor: "#000",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 5,
    },
    subtitle: {
      fontSize: 18,
      color: theme.foreground,
      marginBottom: 20,
      textAlign: "center",
    },
    buttonContainer: {
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.foreground,
      marginBottom: 20,
      textAlign: "center",
    },
  });
}
