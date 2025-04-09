import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{ animation: "slide_from_right" }}>
            <Stack.Screen name="index" options={{ title: "Orders", headerTitleAlign: "center" }} />
            <Stack.Screen name="[id]" options={{ title: "Order Details" }} />
        </Stack>
    );
}