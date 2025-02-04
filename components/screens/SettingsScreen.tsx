import { View, Text, StyleSheet } from "react-native";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { useTheme } from "@/lib/hooks/useTheme";

export default function SettingsScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemeToggleButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
