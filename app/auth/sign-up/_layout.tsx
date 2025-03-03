import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { View } from 'react-native';

export default function TabLayout() {
    const theme = useTheme();
    
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#fddad5", 
            tabBarPosition: 'top',
            tabBarStyle: {
                height: 100,
                backgroundColor: "#fa5f4d", 
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 5,
                elevation: 4,
                overflow: "hidden",
                position: "relative",
            },
            tabBarLabelStyle: {
                fontSize: 16,
                fontWeight: "bold",
                paddingBottom: 8,
            },
            headerShown: false,
            tabBarBackground: () => (
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: "50%",
                        height: 3,
                        backgroundColor: "white",
                        borderRadius: 2,
                        left: "25%", 
                    }}
                />
            ),
        }}>
            <Tabs.Screen
                name="user"
                options={{
                    title: 'User',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={30} name="user" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="canteen"
                options={{
                    title: 'Canteen',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={30} name="store" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
