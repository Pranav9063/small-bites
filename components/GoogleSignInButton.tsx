import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GoogleSignInButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="logo-google" color="white" style={styles.buttonIcon} />
      <Text style={styles.buttonText}> Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#4285F4",
    borderRadius: 5,
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    marginRight: 10,
  },
  buttonIcon: {
    fontSize: 18,
  },
});
