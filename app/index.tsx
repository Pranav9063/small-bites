import { View, Button, Text, StyleSheet } from "react-native";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../lib/context/AuthContext";
import { useTheme } from "@/lib/hooks/useTheme";
import SettingsScreen from "@/components/screens/SettingsScreen";

export default function AuthScreen() {
  const { user, signIn, signOut } = useAuth();
  const styles = createStyles();

  return (
    <View style={styles.container}>
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
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.foreground,
    },
  });
}
