import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'blue',
            tabBarPosition: 'top',
            headerShown: false,
            tabBarStyle: { height: 120 },
            tabBarLabelStyle: { marginTop: 8 , fontSize: 14 },
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