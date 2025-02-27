import { StyleSheet, Text } from "react-native";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/context/AuthContext";
import { useTheme } from "react-native-paper";
import { Theme } from "@/constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function SignUpPage() {
    const { signIn } = useAuth();
    const theme = useTheme();
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
            backgroundColor: theme.colors.background,
        },
        text: {
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 20,
            color: theme.colors.onBackground,
        },
        link: {
            color: theme.colors.primary,
            textDecorationLine: "underline",
        },
    });
}
