import { View, Text, StyleSheet, Animated, Image, Dimensions } from "react-native";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/context/AuthContext";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { FC, useEffect, useRef } from "react";
import { Theme } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const LoginPage: FC = () => {
  const { signIn } = useAuth();
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.innerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/icon.jpg")} style={styles.logo} />
          <View style={styles.logoOverlay}>
            <Ionicons name="restaurant" size={40} color="#FFD337" />
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Welcome to Small Bites 🍽️</Text>
          <Text style={styles.subheading}>
            Order your favorite food from campus canteens with ease!
          </Text>
        </View>

        {/* Sign In Button */}
        <View style={styles.buttonContainer}>
          <GoogleSignInButton onPress={() => { signIn("user"); router.replace("/") }} />
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Register your canteen{" "}
            <Link href="/auth/canteen" style={styles.link}>
              here
            </Link>
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>Delicious food at your fingertips</Text>
          <View style={styles.footerLine} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    innerContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    logoContainer: {
      position: 'relative',
      marginBottom: 40,
    },
    logo: {
      width: width * 0.35,
      height: width * 0.35,
      borderRadius: width * 0.175,
      backgroundColor: '#f5f5f5',
    },
    logoOverlay: {
      position: 'absolute',
      right: -10,
      bottom: -10,
      backgroundColor: '#fff',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 12,
      textAlign: "center",
    },
    subheading: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      maxWidth: '80%',
      lineHeight: 22,
    },
    buttonContainer: {
      width: '100%',
      marginBottom: 24,
    },
    registerContainer: {
      marginBottom: 40,
    },
    registerText: {
      fontSize: 14,
      color: "#666",
      textAlign: "center",
    },
    link: {
      color: "#FFD337",
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
    },
    footerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#f0f0f0',
    },
    footerText: {
      marginHorizontal: 12,
      color: '#999',
      fontSize: 12,
      fontWeight: '500',
    },
  });

export default LoginPage;