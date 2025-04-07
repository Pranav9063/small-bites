import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/AuthContext';
import { deleteMenuItemFromCanteen, fetchCanteenByCanteenOwnerId } from '@/lib/services/firestoreService';

export default function Menu() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const {user} = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(()=>{
    const fetchMenuItems = async () => {
      try {
        const canteenData = await fetchCanteenByCanteenOwnerId(user?.uid || '') as CanteenData;
        if (canteenData) {
          const menu = canteenData.menu || []; // Adjust based on your data structure
          console.log("Fetched menu items:", menu);    
          setMenuItems(menu);
        } else {
          console.log("No canteen data found for this user.");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }
    fetchMenuItems();
  },[])
  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  if(!menuItems) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, color: "#333" }}>Loading...</Text>
      </View>
    );
  }
  // Toggle item availability
  const toggleAvailability = (id: string) => {
    setMenuItems(prevItems => prevItems.map(item =>
        item.item_id === id ? { ...item, availability : !item.availability } : item
      )
    );
  };

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      const result = await deleteMenuItemFromCanteen(user?.uid || '', id);
      if (result.success) {
        setMenuItems(prevItems => prevItems.filter(item => item.item_id !== id));
        Alert.alert("Success", "Item deleted successfully.");
      }
      else {
        throw new Error("Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Edit item
  const handleEditItem = (item: MenuItem) => {
    router.push({
      pathname: "/canteen/editItem",
      params: { 
        id: item.item_id,
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        calories: item.calories?.toString() || "0"
      }
    });
  };

  // Add new item
  const handleAddItem = () => {
    router.push("/canteen/addItem");
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Ionicons name="add-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <ScrollView 
          style={styles.menuList}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item) => (
            <View key={item.item_id} style={styles.menuItem}>
              {item.image && <Image source={{uri : item.image}} style={styles.itemImage} />}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                {item.calories && (
                  <Text style={styles.itemCalories}>{item.calories} cal</Text>
                )}
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity 
                  style={[
                    styles.availabilityButton,
                    !item.availability && styles.unavailableButton,
                  ]}
                  onPress={() => toggleAvailability(item.item_id)}
                >
                  <Text style={[
                    styles.availabilityText,
                    !item.availability && styles.unavailabilityText,
                  ]}>
                    {item.availability ? 'Available' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditItem(item)}
                  >
                    <Ionicons name="create-outline" size={20} color="#666" />
                  </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => 
                      Alert.alert(
                      "Confirm Delete",
                      "Are you sure you want to delete this item?",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Delete", style: "destructive", onPress: () => deleteItem(item.item_id) }
                      ]
                      )
                    }
                    >
                    <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#FFD337',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#333',
    fontWeight: '600',
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  availabilityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },
  unavailableButton: {
    backgroundColor: '#FFEBEE',
  },
  availabilityText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  unavailabilityText: {
    color: '#FF5252',
  },
  editButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  itemCalories: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});