import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GoogleSignInButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="logo-google" color="#000" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff", 
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d36b5f",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, 
  },
  buttonText: {
    color: "#4a1e1e", 
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonIcon: {
    fontSize: 20,
  },
});
