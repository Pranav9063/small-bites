import { StyleSheet, Text } from "react-native";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/context/AuthContext";
import { useTheme } from "@/lib/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Theme } from "@/constants/Colors";

export default function SignUpPage() {
    const { signIn } = useAuth();
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <GoogleSignInButton onPress={signIn} />

            <Text style={styles.text}> Already a User ? Continue to <Link href="/auth/login" style={styles.link}>Login</Link></Text>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
        },
        text: {
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 20,
            color: theme.foreground,
        },
        link: {
            color: theme.primary,
            textDecorationLine: "underline",
        },
    });
}
