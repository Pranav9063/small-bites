import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
    const theme = useTheme();
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.backdrop,
            tabBarPosition: 'top',
            tabBarStyle: {
                height:110
            },
            tabBarLabelStyle: {
                fontSize: 14,
                padding: 8,
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name="user"
                options={{
                    title: 'User',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="canteen"
                options={{
                    title: 'Canteen',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="store" color={color} />,
                }}
            />
        </Tabs>
    );
}