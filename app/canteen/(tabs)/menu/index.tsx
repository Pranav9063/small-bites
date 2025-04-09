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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/AuthContext';
import { deleteMenuItemFromCanteen, fetchCanteenByCanteenOwnerId } from '@/lib/services/firestoreService';
import { useTheme } from 'react-native-paper';
import { Theme } from '@/constants/Theme';

export default function Menu() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = React.useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const theme = useTheme();

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

  useEffect(() => {
    fetchMenuItems();
  }, [])
  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];
  const styles = createStyles(theme);

  if (!menuItems) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, color: "#333" }}>Loading...</Text>
      </View>
    );
  }
  // Toggle item availability
  const toggleAvailability = (id: string) => {
    setMenuItems(prevItems => prevItems.map(item =>
      item.item_id === id ? { ...item, availability: !item.availability } : item
    )
    );
  };

  // Delete item
  const deleteItem = async (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
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
              Alert.alert("Error", "Failed to delete item. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Edit item
  const handleEditItem = (item: MenuItem) => {
    router.push({
      pathname: "/canteen/menu/editItem",
      params: {
        id: item.item_id,
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        calories: item.calories?.toString() || "0",
        description: item.description || ""
      }
    });
  };

  // Add new item
  const handleAddItem = () => {
    router.push("/canteen/menu/add");
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchMenuItems();
    } catch (error) {
      console.log("Error refreshing menu items:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Ionicons name="add-circle" size={28} color="#FFD337" />
          </TouchableOpacity>
        </View> */}

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
        <ScrollView contentContainerStyle = {{paddingBottom:70}}
          style={styles.menuList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <View key={item.item_id} style={styles.menuItem}>
                <View style={styles.itemHeader}>
                  {item.image ? (
                    <Image source={{uri: item.image}} style={styles.itemImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Ionicons name="fast-food" size={24} color="#ccc" />
                    </View>
                  )}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.priceCaloriesContainer}>
                      <Text style={styles.itemPrice}>₹{item.price}</Text>
                      {item.calories && (
                        <Text style={styles.itemCalories}>{item.calories} cal</Text>
                      )}
                    </View>
                    {item.description && (
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                  </View>
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
                      <Ionicons name="create" size={20} color="#666" />
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
                      <Ionicons name="trash" size={20} color="#FF4D4D" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noItemsContainer}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.noItemsText}>No items found</Text>
              <Text style={styles.noItemsSubtext}>Try changing your search or category</Text>
            </View>
          )}
        </ScrollView>
      

        {/* Add menu button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
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
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      padding: 16,
      elevation: 5
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#f5f5f5',
      marginHorizontal: 16,
      marginBottom: 12,
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
      backgroundColor: theme.colors.primary,
    },
    categoryText: {
      fontSize: 14,
      color: '#666',
    },
    selectedCategoryText: {
      color: 'white',
      fontWeight: '600',
    },
    // menuList: {
    //   flex: 1,
    //   paddingHorizontal: 16,
    // },
    // menuItem: {
    //   flexDirection: 'row',
    //   padding: 12,
    //   backgroundColor: '#fff',
    //   borderRadius: 12,
    //   marginBottom: 16,
    //   shadowColor: '#000',
    //   shadowOffset: {
    //     width: 0,
    //     height: 2,
    //   },
    //   shadowOpacity: 0.1,
    //   shadowRadius: 4,
    //   elevation: 3,
    // },
    // itemImage: {
    //   width: 60,
    //   height: 60,
    //   borderRadius: 8,
    // },
    // itemDetails: {
    //   flex: 1,
    //   marginLeft: 12,
    //   justifyContent: 'center',
    // },
    // itemName: {
    //   fontSize: 16,
    //   fontWeight: '600',
    //   color: '#333',
    //   marginBottom: 4,
    // },
    // itemPrice: {
    //   fontSize: 14,
    //   color: '#666',
    // },
    itemActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    },
    availabilityButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#E8F5E9',
    },
    unavailableButton: {
      backgroundColor: '#FFEBEE',
    },
    availabilityText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#4CAF50',
    },
    unavailabilityText: {
      color: '#FF5252',
      fontWeight: '500',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    editButton: {
      padding: 8,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      padding: 8,
      backgroundColor: '#ffeeee',
      borderRadius: 12,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // itemCalories: {
    //   fontSize: 12,
    //   color: '#666',
    //   marginTop: 2,
    // },
    // Add these to your StyleSheet:

menuList: {
  flex: 1,
  paddingHorizontal: 16,
},
menuItem: {
  padding: 16,
  backgroundColor: '#fff',
  borderRadius: 16,
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
itemHeader: {
  flexDirection: 'row',
  marginBottom: 12,
},
itemImage: {
  width: 80,
  height: 80,
  borderRadius: 12,
},
placeholderImage: {
  width: 80,
  height: 80,
  borderRadius: 12,
  backgroundColor: '#f5f5f5',
  justifyContent: 'center',
  alignItems: 'center',
},
itemDetails: {
  flex: 1,
  marginLeft: 16,
  justifyContent: 'center',
},
itemName: {
  fontSize: 18,
  fontWeight: '600',
  color: '#333',
  marginBottom: 4,
},
priceCaloriesContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},
itemPrice: {
  fontSize: 16,
  fontWeight: '500',
  color: '#333',
  marginRight: 12,
},
itemCalories: {
  fontSize: 14,
  color: '#777',
  backgroundColor: '#f0f0f0',
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 12,
},
itemDescription: {
  fontSize: 14,
  color: '#666',
  lineHeight: 20,
},
noItemsContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 60,
},
noItemsText: {
  fontSize: 18,
  fontWeight: '600',
  color: '#666',
  marginTop: 16,
},
noItemsSubtext: {
  fontSize: 14,
  color: '#999',
  marginTop: 8,
},
  })
};