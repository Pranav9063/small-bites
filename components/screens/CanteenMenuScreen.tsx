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
import { useCart } from "../../lib/context/CartContext";
import { fetchCanteenById } from "@/lib/services/firestoreService";
import { Snackbar } from "react-native-paper";
import { CanteenData, MenuItem } from "@/assets/types/db";

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
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const { cart, dispatch } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>("");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const data = (await fetchCanteenById(canteenId)) as CanteenData;
      console.log("Fetched menu items:", data.menu);
      setMenuItems(data.menu);
    };
    fetchMenuItems();
  }, []);

  if (!menuItems) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading delicious items...</Text>
      </View>
    );
  }

  const categories = [
    { name: "All" },
    { name: "Breakfast" },
    { name: "Lunch" },
    { name: "Dinner" },
  ];

  const addToCart = (item: MenuItem) => {
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

    setLastAddedItem(item.name);
    setVisible(true);

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

  const toggleExpandItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const renderCanteenItem = ({ item }: { item: MenuItem }) => {
    const isFavorite = favorites.includes(item.item_id);
    const isExpanded = expandedItem === item.item_id;

    return (
      <View style={styles.canteenCard}>
        <View style={styles.cardContent}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => toggleExpandItem(item.item_id)}
            style={styles.imageContainer}
          >
            <Image source={{ uri: item.image }} style={styles.canteenImage} />
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.item_id)}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#FF5252" : "#fff"}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <View style={styles.canteenNameContainer}>
              <Text style={styles.canteenNameText}>{item.name}</Text>
            </View>

            <View style={styles.itemDescriptionContainer}>
              <Text
                style={styles.itemDescriptionText}
                numberOfLines={isExpanded ? undefined : 2}
              >
                {item.description ||
                  `Delicious ${item.name} made with authentic recipes and fresh ingredients.`}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.priceText}>₹{item.price}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(item)}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{canteenName}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#212121" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={22} color="#757575" />
          <TextInput
            placeholder="Search for dishes..."
            style={styles.searchInput}
            placeholderTextColor="#757575"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={22} color="#1976D2" />
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
              {selectedCategory === category.name && (
                <View style={styles.categoryIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={menuItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === "All" ||
              item.category === selectedCategory.toLowerCase())
        )}
        renderItem={renderCanteenItem}
        keyExtractor={(item) => item.item_id}
        contentContainerStyle={styles.canteenList}
        showsVerticalScrollIndicator={false}
      />

      {cartItemsCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() =>
            router.push({
              pathname: "/user/cart",
              params: {
                id: canteenId,
                name: canteenName,
              },
            })
          }
        >
          <View style={styles.cartButtonContent}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartItemCount}>
                {cartItemsCount} {cartItemsCount === 1 ? "ITEM" : "ITEMS"}
              </Text>
              <Text style={styles.cartTotalAmount}>₹{cartTotalAmount}</Text>
            </View>
            <View style={styles.viewCartContainer}>
              <Text style={styles.cartButtonText}>View Cart</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      )}

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
      flex: 1,
      backgroundColor: "#F5F5F7",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#212121",
    },
    backButton: {
      padding: 8,
    },
    menuButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
    },
    loadingText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1976D2",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "#FFFFFF",
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F1F3F4",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 24,
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 15,
      color: "#212121",
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#F1F3F4",
      justifyContent: "center",
      alignItems: "center",
    },
    categoriesWrapper: {
      paddingVertical: 12,
      backgroundColor: "#FFFFFF",
      marginBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },
    categoriesContainer: {
      paddingHorizontal: 12,
    },
    categoryButton: {
      alignItems: "center",
      marginHorizontal: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: "#F5F5F7",
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#757575",
    },
    selectedCategory: {
      backgroundColor: "#E3F2FD",
    },
    selectedCategoryText: {
      color: "#1976D2",
      fontWeight: "700",
    },
    categoryIndicator: {
      width: 24,
      height: 3,
      backgroundColor: "#1976D2",
      borderRadius: 1.5,
      marginTop: 6,
      position: "absolute",
      bottom: -2,
    },
    canteenList: {
      paddingHorizontal: 12,
      paddingBottom: 100,
      paddingTop: 8,
    },
    canteenCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      flexDirection: 'row',
      height: 140,
    },
    imageContainer: {
      width: 140,
      height: '100%',
      position: 'relative',
    },
    canteenImage: {
      width: '100%',
      height: '100%',
    },
    favoriteButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    infoSection: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
    canteenNameContainer: {
      marginBottom: 4,
    },
    canteenNameText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#212121",
    },
    itemDescriptionContainer: {
      marginVertical: 8,
    },
    itemDescriptionText: {
      fontSize: 13,
      color: "#757575",
      lineHeight: 18,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
    },
    priceText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#212121',
    },
    addButton: {
      backgroundColor: "#1976D2",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    addButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 14,
    },
    cartButton: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: "#1976D2",
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    cartButtonContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    cartInfo: {
      flexDirection: "column",
    },
    cartItemCount: {
      color: "#E0E0E0",
      fontSize: 12,
      fontWeight: "bold",
    },
    cartTotalAmount: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    viewCartContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    cartButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      marginRight: 4,
    },
    snackbar: {
      backgroundColor: "#4CAF50",
      borderRadius: 8,
      marginBottom: 80,
    },
  });

export default CanteenMenuScreen;