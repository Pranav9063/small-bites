import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { OrderProvider } from '@/context/OrderContext';

function TabContent() {
    const theme = useTheme();
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary, tabBarStyle: { height: 55 } }}>
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Orders',headerTitleAlign: "center",
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="receipt-outline" color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="book-outline" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Analytics', headerTitleAlign: "center",
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="stats-chart-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="reviews"
                options={{
                    title: 'Reviews',headerTitleAlign: "center",
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="star-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="person-outline" color={color} />,
                }}
            />
        </Tabs>
    );
}

export default function Layout() {
    return (
        <OrderProvider>
            <TabContent />
        </OrderProvider>
    );
}