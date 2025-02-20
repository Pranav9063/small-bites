import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@/lib/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeToggleButton() {
  const { colorScheme, toggleTheme } = useTheme();

  return (
    <Pressable style={styles.button} onPress={() => toggleTheme(colorScheme === "dark" ? "light" : "dark")}>
      <Ionicons name={colorScheme === "dark" ? "sunny" : "moon"} size={24} color="white" />
      
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30, 
    height: 30, 
    backgroundColor: "#444", 
    borderRadius: 55, 
    justifyContent: "center", 
    alignItems: "center", 
  },
});
