import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "../../lib/context/CartContext";
import { fetchCanteenById } from "@/lib/services/firestoreService";
import { Snackbar } from "react-native-paper";

type CartItem = MenuItem & {
  quantity: number;
};

type CanteenMenuScreenProps = {
  canteenId: string;
  canteenName: string;
};

const CanteenMenuScreen: React.FC<CanteenMenuScreenProps> = ({
  canteenId,
  canteenName,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>([]);
  const { cart, dispatch } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      const data = (await fetchCanteenById(canteenId)) as CanteenData;
      setMenuItems(data.menu);
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    console.log("Updated Menu Items:", menuItems);
  }, [menuItems]);

  if (!menuItems) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultsTitle}>Loading...</Text>
      </View>
    );
  }

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
    menuItems.reduce((acc, item) => ({ ...acc, [item.item_id]: 1 }), {})
  );

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  const updateItemQuantity = (itemId: string, delta: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = itemQuantities[item.item_id] || 1;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: quantity,
      },
    });

    // Set the last added item and show Snackbar
    setLastAddedItem(item.name);
    setVisible(true);

    // Reset quantity for the specific item
    setItemQuantities((prev) => ({ ...prev, [item.item_id]: 1 }));

    // Automatically dismiss Snackbar after 2 seconds
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const isFavorite = favorites.includes(item.item_id);
    const quantity = itemQuantities[item.item_id] || 1;

    return (
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItem}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.imageOverlay} />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.item_id)}
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
            <Text style={styles.itemPrice}>Rs.{item.price.toFixed(2)}</Text>
            <View style={styles.actionContainer}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() => updateItemQuantity(item.item_id, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateItemQuantity(item.item_id, 1)}
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
      </View>
    );
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{canteenName}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push({pathname: "/user/cart",  params: {
            canteenId: canteenId,
            canteenName: canteenName,
          }})}
        >
          <Ionicons name="cart-outline" size={24} color="#333" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search Food..."
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#333" />
        </TouchableOpacity>
      </View>

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
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.item_id}
        contentContainerStyle={styles.menuList}
      />

      {/* Global Snackbar Notification */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {`${lastAddedItem} added to Cart`}
      </Snackbar>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#F5F5F5", // Light grey background
    },
    fixedHeader: {
      backgroundColor: "#fff",
      paddingTop: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
      zIndex: 1,
    },
    scrollableContent: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: "#FFFFFF", // White header
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
    },
    cartButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
    },
    cartBadge: {
      position: "absolute",
      right: -5,
      top: -5,
      backgroundColor: "#FF3B30",
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    cartBadgeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10, // Added vertical padding
      paddingBottom: 16,
      gap: 12,
      backgroundColor: "#FFFFFF",
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f0f0f0", // Lighter background
      paddingHorizontal: 16,
      paddingVertical: 8, // Reduced vertical padding
      borderRadius: 25,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8, // Reduced left margin
      fontSize: 16,
      color: "#333",
    },
    filterButton: {
      width: 40, // Reduced width
      height: 40, // Reduced height
      borderRadius: 20, // Adjusted border radius
      backgroundColor: "#FFD337",
      justifyContent: "center",
      alignItems: "center",
    },
    categoriesWrapper: {
      paddingLeft: 16,
      marginTop: 10,
    },
    categoriesContainer: {
      paddingRight: 16,
    },
    categoryButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: "#f0f0f0",
      marginRight: 10,
    },
    selectedCategory: {
      backgroundColor: "#FFD337",
    },
    categoryText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#666",
    },
    selectedCategoryText: {
      color: "#333",
    },
    resultsContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    resultsTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
    },
    resultsCount: {
      fontSize: 28,
      fontWeight: "600",
      color: "#666",
    },
    menuList: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    menuItemContainer: {
      marginBottom: 20,
    },
    menuItem: {
      backgroundColor: "#fff",
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    itemImage: {
      width: "100%",
      height: 200,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    itemContent: {
      padding: 16,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    itemName: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF9E6",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    ratingText: {
      marginLeft: 4,
      color: "#333",
      fontWeight: "600",
    },
    itemDescription: {
      fontSize: 14,
      color: "#666",
      marginBottom: 12,
    },
    itemFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    stat: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statText: {
      marginLeft: 4,
      color: "#666",
      fontSize: 12,
    },
    itemPrice: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FFD337",
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
    favoriteButton: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 2,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 20,
      padding: 8,
    },
    actionContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#f0f0f0",
    },
    quantityControl: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      borderRadius: 25,
      padding: 4,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    quantityButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    quantity: {
      fontSize: 16,
      fontWeight: "bold",
      marginHorizontal: 12,
      color: "#333",
    },
    addButton: {
      backgroundColor: "#FFD337",
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    addButtonText: {
      color: "#333",
      fontSize: 14,
      fontWeight: "bold",
    },
    snackbar: {
      backgroundColor: "#4CAF50", // Green background for success
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

export default CanteenMenuScreen;
