import { Tabs } from 'expo-router';
import UserTabBar from '@/components/UserTabBar';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs tabBar={props => <UserTabBar {...props} />} screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false, }}>
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
