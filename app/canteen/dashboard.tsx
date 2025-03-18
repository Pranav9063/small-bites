import React from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, FlatList, 
  Image, TouchableOpacity, TextInput, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';

const menuItems = [
  { id: '1', name: 'Chicken Burger', image: require('@/assets/images/menuItems/burger.jpg'), available: true },
  { id: '2', name: 'Chicken Hell', image: require('@/assets/images/menuItems/burger.jpg'), available: false },
  { id: '3', name: "Farmer's Delight", image: require('@/assets/images/menuItems/burger.jpg'), available: true },
  { id: '4', name: 'Margherita Pizza', image: require('@/assets/images/menuItems/burger.jpg'), available: true },
  { id: '5', name: 'Veg Burger', image: require('@/assets/images/menuItems/burger.jpg'), available: true },
  { id: '6', name: 'Unknown Item', image: require('@/assets/images/menuItems/burger.jpg'), available: true },
];

export default function Dashboard() {
  const router = useRouter();
  const{signOut} = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#999" />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={item.image} style={styles.menuItemImage} />
            <Text style={styles.menuItemName}>{item.name}</Text>
            <TouchableOpacity 
              style={[styles.availabilityButton, !item.available && styles.notAvailableButton]}
            >
              <Text style={styles.availabilityText}>
                {item.available ? 'Available' : 'Not Available'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabText, styles.activeTab]}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/canteen/updateMenu')}>
        <Text style={styles.tabText}>Update Menu</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={signOut}>
        <Text style={styles.tabText}>Sign Out</Text>
      </TouchableOpacity>

      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  menuButton: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: '#000080', marginRight: 40 },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginRight: 10 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  filterButton: { backgroundColor: '#000080', width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuItemImage: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  menuItemName: { flex: 1, fontSize: 16, fontWeight: '500' },
  availabilityButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  notAvailableButton: { backgroundColor: '#ffe0e0', borderColor: '#ffcccc' },
  availabilityText: { fontSize: 12, color: '#333' },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingVertical: 10 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { fontSize: 16, color: '#999' },
  activeTab: { color: '#000080', fontWeight: '600' },
});