import { Tabs } from 'expo-router';
import UserTabBar from '@/components/UserTabBar';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    // tabBar={props => <UserTabBar {...props} />}
    <Tabs  screenOptions={{ tabBarActiveTintColor: 'blue' , headerShown: false, }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="heart-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="cash-outline" color={color} />,
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
