import { Stack } from 'expo-router';
import { OrderProvider } from '../../context/OrderContext';

export default function Layout() {
    return (
        <OrderProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="menu" options={{ headerShown: false }} />
                <Stack.Screen name="history" options={{ headerShown: true, title: "Analytics" }} />
                <Stack.Screen name="updateMenu" options={{ headerShown: false }} />
                <Stack.Screen name="OrderDet" options={{ headerShown: false }} />
                <Stack.Screen name="addItem" options={{ headerShown: false }} />
                <Stack.Screen name="orders" options={{ headerShown: true, title: "Orders" }} />
                <Stack.Screen name="orders/index" options={{ headerShown: true, title: "Orders" }} />
                <Stack.Screen name="reviews" options={{ headerShown: true, title: "Reviews" }} />
                <Stack.Screen name="Profile" options={{ headerShown: true, title: "Profile" }} />
            </Stack>
        </OrderProvider>
    );
}  