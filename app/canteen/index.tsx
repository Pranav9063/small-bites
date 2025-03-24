import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('Menu');

  const menuOptions = [
    { id: 1, title: 'Menu', icon: 'book-outline' as const },
    { id: 2, title: 'Orders', icon: 'cart-outline' as const },
    { id: 3, title: 'Analytics', icon: 'stats-chart-outline' as const },
    { id: 4, title: 'Reviews', icon: 'star-outline' as const },
  ];

  const handleOptionPress = (title: string) => {
    switch(title) {
      case 'Menu':
        router.push('/canteen/menu');  // Updated this line
        break;
      case 'Orders':
        router.push('/canteen/orders');
        break;
      case 'Reviews':
        router.push('/canteen/history');
        break;
      case 'Profile':
        router.push('/canteen');
        break;
    }
    setActiveSection(title);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Dashboard</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={require("@/assets/images/food-app.png")} style={styles.profilePic} />
          </TouchableOpacity>
        </View>

        {/* Options Grid */}
        <View style={styles.optionsGrid}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option.title)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={option.icon} size={32} color="#333" />
              </View>
              <Text style={styles.optionText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Navigation */}
        {/* <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#FFD337" />
            <Text style={[styles.navText, { color: '#FFD337' }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="stats-chart-outline" size={24} color="#666" />
            <Text style={styles.navText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.centerButton, styles.centerButtonGradient]}>
            <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="settings-outline" size={24} color="#666" />
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  optionsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFD337',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  centerButton: {
    marginTop: -30,
  },
  centerButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFD337",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});