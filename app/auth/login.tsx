import { View, Text, StyleSheet, Animated, Image } from "react-native";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/context/AuthContext";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link} from "expo-router";
import { FC, useEffect, useRef  } from "react";
import { Theme } from "@/constants/Theme";

const LoginPage: FC = () => {
  const { signIn } = useAuth();
  const theme = useTheme();

  const styles = createStyles(theme);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
      <Image source={require("@/assets/images/icon.jpg")} style={styles.logo} />
      <Text style={styles.heading}>Welcome to Small Bites 🍽️</Text>
      <Text style={styles.subheading}>
        Order your favorite food from campus canteens with ease!
      </Text>

      <GoogleSignInButton onPress={() => signIn("user")} />

      <Text style={styles.text}>
        Register your canteen{" "}
        <Link href="/auth/canteen" style={styles.link}>
          here
        </Link>
      </Text>
    </Animated.View>
  </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f78477",
      paddingHorizontal: 20,
    },
    innerContainer: {
      alignItems: "center",
      width: "100%",
    },
    logo: {
      width: 100, 
      height: 100,
      marginBottom: 20,
      borderRadius: 50,
      resizeMode: "contain",
    },
    heading: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#4a1e1e",
      marginBottom: 10,
      textAlign: "center",
    },
    subheading: {
      fontSize: 16,
      color: theme.colors.onBackground,
      marginBottom: 30,
      textAlign: "center",
    },
    text: {
      fontSize: 14,
      fontWeight: "500",
      marginTop: 20,
      color: "#4a1e1e",
    },
    link: {
      color: "#4a1e1e",
      textDecorationLine: "underline",
      fontWeight: "bold",
    },
  });

export default LoginPage;