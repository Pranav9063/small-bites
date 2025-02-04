import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@/lib/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeToggleButton() {
  const { colorScheme, toggleTheme } = useTheme();

  return (
    <Pressable style={styles.button} onPress={() => toggleTheme(colorScheme === "dark" ? "light" : "dark")}>
      <Ionicons name={colorScheme === "dark" ? "sunny" : "moon"} size={24} color="white" />
      <Text style={styles.text}>
        {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  text: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
});
