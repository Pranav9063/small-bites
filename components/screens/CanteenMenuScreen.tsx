import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../app/context/CartContext';

// Add types at the top of the file
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  rating: number;
  time: string;
  image: any; // Using 'any' for image require
};

type CartItem = MenuItem & {
  quantity: number;
};

// Update mockMenuItems with type
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pizza',
    description: 'Spicy veg Pizza',
    price: 100.00,
    calories: 90,
    rating: 4.8,
    time: '20-30 min',
    image: require('../../assets/images/menuItems/Piz.jpg'),
  },
  {
    id: '2',
    name: 'Pasta',
    description: 'Spicy veg pasta',
    price: 80.00,
    calories: 78,
    rating: 4.5,
    time: '15-20 min',
    image: require('../../assets/images/menuItems/pasta.jpg'),
  },
  {
    id: '3',
    name: 'Burger',
    description: 'Spicy veg burger',
    price: 60.00,
    calories: 88,
    rating: 4.1,
    time: '10-15 min',
    image: require('../../assets/images/menuItems/burger.jpg'),
  },
  {
    id: '4',
    name: 'Samosa',
    description: 'Crispy samosa',
    price: 10.00,
    calories: 68,
    rating: 4.1,
    time: '0-5 min',
    image: require('../../assets/images/menuItems/samosa.jpg'),
  },
];

type CanteenMenuScreenProps = {
  canteenId: string;
  canteenName: string;
};

const CanteenMenuScreen: React.FC<CanteenMenuScreenProps> = ({ canteenId, canteenName }) => {
  const theme = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const scaleValues = useRef(mockMenuItems.map(() => new Animated.Value(0))).current;
  const { cart, dispatch } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]); // Array of item IDs
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
    mockMenuItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const categories = ['All', 'Pizza', 'Burger', 'Pasta', 'Drinks'];

  React.useEffect(() => {
    scaleValues.forEach((scaleValue, index) => {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
        delay: index * 100,
      }).start();
    });
  }, []);

  const updateItemQuantity = (itemId: string, delta: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  };

  // Add to cart function
  const addToCart = (item: MenuItem) => {
    const quantity = itemQuantities[item.id] || 1;
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity
      }
    });
    // Reset quantity after adding to cart
    setItemQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  // Toggle favorite function
  const toggleFavorite = (itemId: string) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = ({ item, index }: { item: MenuItem; index: number }) => {
    const isFavorite = favorites.includes(item.id);
    const quantity = itemQuantities[item.id] || 1;

    return (
      <Animated.View style={[
        styles.menuItemContainer,
        {
          transform: [{ scale: scaleValues[index] }],
        }
      ]}>
        <View style={styles.menuItem}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.imageOverlay} />
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF4D4D" : "#fff"} 
            />
          </TouchableOpacity>
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <View style={styles.itemFooter}>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Ionicons name="flame" size={16} color="#FF9500" />
                  <Text style={styles.statText}>{item.calories} Cal</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.statText}>{item.time}</Text>
                </View>
              </View>
              <Text style={styles.itemPrice}>Rs.{item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.quantityControl}>
                <TouchableOpacity 
                  onPress={() => updateItemQuantity(item.id, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => updateItemQuantity(item.id, 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>{item}</Text>
    </TouchableOpacity>
  );

  const ListHeaderComponent = () => (
    <>
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Found</Text>
        <Text style={styles.resultsCount}>{mockMenuItems.length} results</Text>
      </View>
    </>
  );

  // Update cart badge count
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Food</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push("/cart")}
          >
            <Ionicons name="cart-outline" size={24} color="#333" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search food..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <View style={styles.scrollableContent}>
        <FlatList
          data={mockMenuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#FFD337" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#666" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.centerButton, styles.centerButtonGradient]}>
          <Ionicons name="grid" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bookmark-outline" size={24} color="#666" />
          <Text style={styles.navText}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    fixedHeader: {
      backgroundColor: '#fff',
      paddingTop: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      zIndex: 1,
    },
    scrollableContent: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    cartButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartBadge: {
      position: 'absolute',
      right: -5,
      top: -5,
      backgroundColor: '#FF3B30',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 12,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: '#333',
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: '#FFD337',
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoriesContainer: {
      paddingTop: 16,
    },
    categoriesList: {
      paddingHorizontal: 16,
    },
    categoryButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#f5f5f5',
      marginRight: 12,
    },
    selectedCategory: {
      backgroundColor: '#FFD337',
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
    },
    selectedCategoryText: {
      color: '#333',
    },
    resultsContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    resultsTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
    },
    resultsCount: {
      fontSize: 28,
      fontWeight: '600',
      color: '#666',
    },
    menuList: {
      padding: 16,
      paddingTop: 0,
    },
    menuItemContainer: {
      marginBottom: 20,
    },
    menuItem: {
      backgroundColor: '#fff',
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    itemImage: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    itemContent: {
      padding: 16,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    itemName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF9E6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    ratingText: {
      marginLeft: 4,
      color: '#333',
      fontWeight: '600',
    },
    itemDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 12,
    },
    itemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statText: {
      marginLeft: 4,
      color: '#666',
      fontSize: 12,
    },
    itemPrice: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFD337',
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    },
    navItem: {
      alignItems: 'center',
    },
    navText: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },
    centerButton: {
      marginTop: -30,
    },
    centerButtonGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#FFD337',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    favoriteButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 2,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 20,
      padding: 8,
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 25,
      padding: 4,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    quantityButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    quantity: {
      fontSize: 16,
      fontWeight: 'bold',
      marginHorizontal: 12,
      color: '#333',
    },
    addButton: {
      backgroundColor: '#FFD337',
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    addButtonText: {
      color: '#333',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

export default CanteenMenuScreen; 