import { StyleSheet, Text, View, Image } from "react-native";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function SignUpPage() {
    const { signIn } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            {/* App Logo */}
            <Image source={require("@/assets/images/icon.jpg")} style={styles.logo} />

            {/* Heading */}
            <Text style={styles.heading}>Join Small Bites 🍔</Text>
            <Text style={styles.subheading}>Delicious food at your fingertips!</Text>

            {/* Google Sign-In Button */}
            <GoogleSignInButton onPress={signIn} />

            {/* Login Link */}
            <View style={styles.loginContainer}>
                <Text style={styles.text}>Already a user? </Text>
                <Link href="/auth/login" style={styles.link}>Login</Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f78477", 
        paddingHorizontal: 20,
    },
    logo: {
        width: 130,
        height: 130,
        marginBottom: 20,
        resizeMode: "contain",
        borderRadius: 50
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4a1e1e", 
        marginBottom: 8,
        textAlign: "center",
    },
    subheading: {
        fontSize: 16,
        color: "#5c2c2c", 
        marginBottom: 25,
        textAlign: "center",
    },
    text: {
        fontSize: 14,
        color: "#4a1e1e",
    },
    link: {
        color: "#ffffff", 
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    loginContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
});
