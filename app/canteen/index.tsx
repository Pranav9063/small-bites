import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  Button,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addSampleMenusToCanteen } from '@/lib/services/firestoreService';
import { useAuth } from '@/lib/context/AuthContext';
const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

const vegMenu: MenuItem[] = [
  {
    item_id: "1",
    name: "Chole Bhature",
    price: 120,
    description: "Spicy chickpea curry served with fluffy deep-fried bread.",
    availability: true,
    category: "Lunch",
  },
  {
    item_id: "2",
    name: "Samosa",
    price: 20,
    description: "Crispy deep-fried pastry filled with spiced potatoes and peas.",
    availability: true,
    category: "Snacks",
  },
  {
    item_id: "3",
    name: "Aloo Paratha",
    price: 80,
    description: "Stuffed wheat flatbread with spiced mashed potatoes, served with butter and curd.",
    availability: true,
    category: "Breakfast",
  },
  {
    item_id: "4",
    name: "Rajma Chawal",
    price: 100,
    description: "Kidney beans cooked in a tomato-based gravy, served with steamed rice.",
    availability: true,
    category: "Lunch",
  },
  {
    item_id: "5",
    name: "Veg Sandwich",
    price: 60,
    description: "Grilled sandwich stuffed with fresh vegetables, cheese, and green chutney.",
    availability: true,
    category: "Breakfast",
  },
  {
    item_id: "6",
    name: "Veg Fried Rice",
    price: 90,
    description: "Stir-fried rice with assorted vegetables, soy sauce, and aromatic spices.",
    availability: true,
    category: "Lunch",
  },
  {
    item_id: "7",
    name: "Paneer Butter Masala",
    price: 150,
    description: "Creamy tomato-based curry with soft paneer cubes, served with naan or rice.",
    availability: true,
    category: "Lunch",
  },
  {
    item_id: "8",
    name: "Masala Dosa",
    price: 110,
    description: "Crispy South Indian dosa stuffed with spicy mashed potatoes, served with chutney and sambar.",
    availability: true,
    category: "Breakfast",
  },
  {
    item_id: "9",
    name: "Pav Bhaji",
    price: 120,
    description: "Spicy mashed vegetable curry served with buttered pav.",
    availability: true,
    category: "Snacks",
  },
  {
    item_id: "10",
    name: "Dhokla",
    price: 70,
    description: "Soft and spongy fermented gram flour snack, garnished with mustard seeds and coriander.",
    availability: true,
    category: "Snacks",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { user , signOut} = useAuth();
  const [activeSection, setActiveSection] = useState('Menu');
  const [menuVisible, setMenuVisible] = useState(false);

  const menuOptions = [
    { id: 1, title: 'Menu', icon: 'book-outline' as const },
    { id: 2, title: 'Orders', icon: 'cart-outline' as const },
    { id: 3, title: 'Analytics', icon: 'stats-chart-outline' as const },
    { id: 4, title: 'Reviews', icon: 'star-outline' as const },
  ];

  if(!user) return null;

  const handleOptionPress = (title: string) => {
    switch (title) {
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
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setMenuVisible(true)}
          >
            <Image source={user?.photoURL ? { uri: user?.photoURL } : require('../../assets/images/canteenImg.png')} style={styles.profilePic} />
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

        {/* <Button onPress={async () => addSampleMenusToCanteen('JgdYxWcnEGxCTJJBfS9X', vegMenu)} title='Add menu'/> */}

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

        <Modal transparent={true} visible={menuVisible} animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.menu}>
              <Text style={styles.menuText}>Hey, {user.displayName}</Text>
              <Text style={styles.menuText}>{user.email}</Text>
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={signOut}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  overlay: {
      flex: 1,
      backgroundColor: "#007AFF",
      justifyContent: "center",
      alignItems: "center",
  },
  menu: {
      backgroundColor: "white",
      padding: 24,
      borderRadius: 20,
      width: "80%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
  },
  menuText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 8,
      textAlign: "center",
  },
  signOutButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 16,
      width: '100%',
  },
  signOutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  closeButton: {
      marginTop: 16,
      paddingVertical: 8,
  },
  closeButtonText: {
      color: '#666',
      fontSize: 16,
      fontWeight: '600',
  },
});