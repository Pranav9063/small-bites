import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
    const theme = useTheme();
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary, tabBarStyle: { height: 55 } }}>
            <Tabs.Screen
                name="orders/index"
                options={{
                    title: 'Orders',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="receipt-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders/[id]"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="book-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Analytics',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="stats-chart-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="reviews"
                options={{
                    title: 'Reviews',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="star-outline" color={color} />,
                }}
            />
        </Tabs>
    );
}
