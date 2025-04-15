import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// Assuming CartContext.tsx is in this relative path
import { useCart } from "../../lib/context/CartContext";
// Assuming firestoreService.ts is in this relative path
import { fetchCanteenById } from "@/lib/services/firestoreService";
import { Snackbar } from "react-native-paper";
// Assuming db.ts defines these types in this relative path
import { CanteenData, MenuItem } from "@/assets/types/db";
// Assuming Theme is defined here
import { Theme } from "@/constants/Theme";

// Interface for MenuItem (ensure this matches your actual type)
// export interface MenuItem {
//   item_id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   description?: string;
//   image?: string;
//   category?: string;
//   rating?: number;
//   ratingCount?: number;
//   isBestseller?: boolean;
//   isCustomizable?: boolean;
// }

type CanteenMenuScreenProps = {
  canteenId: string;
  canteenName: string;
};

const CanteenMenuScreen: React.FC<CanteenMenuScreenProps> = ({
  canteenId,
  canteenName,
}) => {
  const theme = useTheme() as Theme; // Cast theme if using custom Theme type
  const router = useRouter();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const { cart, dispatch } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- Fetch Menu Items ---
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = (await fetchCanteenById(canteenId)) as CanteenData;
        console.log("Fetched menu items:", data.menu);
        // Add mock data if necessary for testing UI elements
        // IMPORTANT: Replace this mock data logic with your actual data structure
        const augmentedMenu = data.menu.map((item, index) => ({
            ...item,
            originalPrice: item.price + 20 + index,
            rating: 4.0 + (index % 5) / 10.0,
            ratingCount: 30 + index * 5,
            category: item.category || (index % 2 === 0 ? 'All Day Breakfast' : 'Lunch')
        }))
        setMenuItems(augmentedMenu);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        setMenuItems([]); // Set to empty array on error
      }
    };
    fetchMenuItems();
  }, [canteenId]);


  // --- Loading State ---
  if (menuItems === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading delicious items...</Text>
      </View>
    );
  }

  // --- Categories ---
  const categories = Array.from(new Set(['All', ...menuItems.map(item => item.category || 'Other')]))
                         .map(name => ({ name: name || 'Other' }));

  // --- Cart Actions ---
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setVisible(true);
  };

  const handleAddItem = (item: MenuItem) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image || "",
      },
    });
    showSnackbar(`${item.name} added to Cart`);
  };

  const handleIncreaseQuantity = (itemId: string) => {
    dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: itemId, delta: 1 }
    });
  };

  const handleDecreaseQuantity = (itemId: string) => {
     dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: itemId, delta: -1 }
     });
  };

  // --- Favorite Action ---
  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // --- Render Item Function ---
  const renderCanteenItem = ({ item }: { item: MenuItem }) => {
    const isFavorite = favorites.includes(item.item_id);
    const cartItem = cart.find((cartEntry) => cartEntry.id === item.item_id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // Ensure description is a string, provide default if null/undefined
    const descriptionText = item.description || `Delicious ${item.name} available.`;

    return (
      <View style={styles.itemCard}>
        {/* Left Side: Details */}
        <View style={styles.itemDetails}>
          {/* Category */}
          <Text style={styles.itemCategory}>{item.category || 'Food'}</Text>
          {/* Name */}
          <Text style={styles.itemName}>{item.name}</Text>
          {/* Rating */}
          {item.rating && item.ratingCount ? ( // Check both rating and count
             <View style={styles.ratingContainer}>
               <Ionicons name="star" size={14} color="#FFB300" />
               <Text style={styles.ratingText}>
                 {`${item.rating.toFixed(1)} (${item.ratingCount} ratings)`}
               </Text>
             </View>
           ) : null /* Render nothing if no rating */}
          {/* Price */}
          <View style={styles.priceContainer}>
             <Text style={styles.currentPrice}>₹{item.price}</Text>
          </View>
          {/* Description */}
          <Text style={styles.itemDescription} numberOfLines={2}>
            {descriptionText}
          </Text>
          {/* Like/Share Icons */}
          <View style={styles.itemActions}>
             <TouchableOpacity onPress={() => toggleFavorite(item.item_id)}>
               <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={22}
                  color={isFavorite ? "#FF5252" : "#757575"}
                />
             </TouchableOpacity>
             <TouchableOpacity style={{ marginLeft: 15 }}>
               <Ionicons name="share-social-outline" size={20} color="#757575" />
             </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Image & Add/Quantity Button */}
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.addQuantityContainer}>
            {quantityInCart === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddItem(item)}
              >
                <Text style={styles.addButtonText}>ADD</Text>
                <Ionicons name="add" size={16} color={theme.colors.primary} style={{ marginLeft: 2 }}/>
              </TouchableOpacity>
            ) : (
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleDecreaseQuantity(item.item_id)}
                >
                  <Ionicons name="remove" size={16} color="white" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantityInCart}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleIncreaseQuantity(item.item_id)}
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // --- Cart Summary ---
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // --- Main Return Structure ---
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        {/* Ensure canteenName is treated as text */}
        <Text style={styles.headerTitle}>{canteenName || 'Canteen Menu'}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#212121" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#757575" />
          <TextInput
            placeholder="Search for dishes..."
            style={styles.searchInput}
            placeholderTextColor="#757575"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

       {/* Categories Scroll */}
       {categories.length > 1 && (
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.name &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
       )}


      {/* Menu List */}
      <FlatList
         data={menuItems.filter(
            (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedCategory === "All" || item.category === selectedCategory)
        )}
        renderItem={renderCanteenItem}
        keyExtractor={(item) => item.item_id}
        contentContainerStyle={styles.canteenList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>No dishes found.</Text>
                 {searchQuery || selectedCategory !== 'All' ? (
                    <Text style={styles.emptyListSubText}>Try adjusting your search or filter.</Text>
                 ) : null}
            </View>
         }
      />

      {/* Cart Button */}
      {cartItemsCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() =>
            router.push({
              pathname: "/user/cart", // Ensure path is correct
              params: { id: canteenId, name: canteenName },
            })
          }
        >
          <View style={styles.cartButtonContent}>
             <View style={styles.cartInfo}>
               <Text style={styles.cartItemCount}>
                  {`${cartItemsCount} ${cartItemsCount === 1 ? "ITEM" : "ITEMS"}`}
                </Text>
                <Text style={styles.cartTotalAmount}>{`₹${cartTotalAmount.toFixed(2)}`}</Text>
            </View>
            <View style={styles.viewCartContainer}>
                <Text style={styles.cartButtonText}>View Cart</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Snackbar */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
        style={styles.snackbar}
        action={{
          label: 'OK',
          onPress: () => { setVisible(false); },
          textColor: '#FFFFFF',
        }}
      >
         {/* Ensure snackbar message is always rendered within Text */}
         <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
};

// --- Styles ---
// Ensure Theme type includes colors.primary and colors.inversePrimary
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F8F8",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
    },
    loadingText: {
      marginTop: 15,
      fontSize: 16,
      fontWeight: "600",
      color: "#555",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    backButton: { padding: 6 },
    menuButton: { padding: 6 },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: "#FFFFFF",
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F0F0F0",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 15,
      color: "#333",
    },
    filterButton: {
      padding: 8,
    },
    categoriesWrapper: {
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        marginBottom: 6,
    },
    categoriesContainer: {
        paddingHorizontal: 12,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    selectedCategory: {
        // Use theme colors safely
        backgroundColor: theme.colors.inversePrimary || '#FFF0F0',
        borderColor: theme.colors.primary || '#D32F2F',
    },
    selectedCategoryText: {
        color: theme.colors.primary || '#D32F2F',
        fontWeight: 'bold',
    },
    canteenList: {
      paddingHorizontal: 16,
      paddingBottom: 100,
      paddingTop: 10,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyListText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    emptyListSubText: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
        textAlign: 'center',
    },
    itemCard: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: '#EEEEEE'
    },
    itemDetails: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
     bestsellerTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    bestsellerText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#E65100',
        marginLeft: 4,
    },
    itemCategory: {
      fontSize: 12,
      color: "#666",
      marginBottom: 2,
      textTransform: 'capitalize',
    },
    itemName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    ratingText: {
        fontSize: 13,
        color: '#555',
        marginLeft: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    currentPrice: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    originalPrice: {
      fontSize: 13,
      color: "#999",
      textDecorationLine: "line-through",
      marginLeft: 8,
    },
    itemDescription: {
      fontSize: 12,
      color: "#777",
      lineHeight: 16,
      marginBottom: 8,
      minHeight: 32,
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
    },
    itemImageContainer: {
      width: 130,
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
      justifyContent: 'space-between',
    },
    itemImage: {
      width: 110,
      height: 110,
      borderRadius: 10,
    },
    addQuantityContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 8,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFF",
      borderWidth: 1.5,
      borderColor: theme.colors.primary || '#D32F2F',
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 18,
      minWidth: 90,
      height: 32,
    },
    addButtonText: {
      color: theme.colors.primary || '#D32F2F',
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 14,
      marginRight: 2,
    },
    quantitySelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.primary || '#D32F2F',
      borderRadius: 8,
      minWidth: 90,
      height: 32,
    },
    quantityButton: {
        paddingHorizontal: 10,
        height: '100%',
        justifyContent: 'center',
    },
    quantityText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 14,
      minWidth: 25,
      textAlign: 'center',
    },
     customizableText: {
        fontSize: 11,
        color: '#777',
        marginTop: 5,
    },
    cartButton: {
        position: "absolute",
        bottom: 15,
        left: 15,
        right: 15,
        backgroundColor: theme.colors.primary || '#D32F2F',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cartButtonContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    cartInfo: {},
    cartItemCount: {
        color: theme.colors.inversePrimary || "#FFEBEE", // Use theme color or fallback
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 2,
    },
    cartTotalAmount: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    viewCartContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    cartButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
        marginRight: 4,
    },
    snackbar: {
       backgroundColor: theme.colors.primary || '#D32F2F',
       borderRadius: 8,
       marginHorizontal: 15,
       // Calculate marginBottom dynamically based on cart state
       // This requires cartItemsCount to be accessible here or passed down
       // For simplicity, using a fixed margin or adjust based on your state management
       marginBottom: 85, // Adjust this value as needed
    },
    snackbarText: {
       color: '#FFFFFF',
    },

  });

export default CanteenMenuScreen;