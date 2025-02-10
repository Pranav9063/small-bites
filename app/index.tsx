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
      <StatusBar barStyle="light-content" />

      {/* Background Overlay */}
      <Image source={require("@/assets/images/logo.jpg")} style={styles.logo} />
      <Text style={styles.appName}>Small Bites</Text>
      <Text style={styles.tagline}>Quick & Delicious Campus Meals</Text>

      <GoogleSignInButton onPress={signIn} />
      {/* {user ? <Text style={styles.text}>Welcome, {user.user.name}</Text> : null}
      {user ? <Button title="Sign Out" onPress={signOut} /> : null} */}
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
      paddingHorizontal: 20,
    },
    appName: {
      fontSize: 26,
      fontWeight: "bold",
      color: theme.foreground,
      marginBottom: 5,
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.foreground,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 20,
    },
    tagline: {
      fontSize: 16,
      color: theme.foreground,
      marginBottom: 30,
    },
  });
}
