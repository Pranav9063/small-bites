import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchSavedOrdersByUserId, SavedOrder } from '@/lib/services/firestoreService';
import { useAuth } from '@/lib/context/AuthContext';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/lib/context/CartContext';

const Favourites = () => {
  const [savedOrders, setSavedOrders] = useState<SavedOrder[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const { dispatch } = useCart();

  const fetchSavedOrders = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const orders = await fetchSavedOrdersByUserId(user.uid);
      setSavedOrders(orders);
    } catch (error) {
      console.error('Error fetching saved orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedOrders();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedOrders();
    setRefreshing(false);
  };

  const handleAddToCart = (order: SavedOrder) => {
    // Add all items to cart and navigate to checkout
    dispatch({
      type: 'SET_CART',
      payload: {
        items: order.cart,
        canteenId: order.canteenId,
        canteenName: order.canteenName
      }
    });
    router.push(`/user/cart?canteenId=${order.canteenId}&canteenName=${order.canteenName}`);
  };

  const handleOrderAgain = (order: SavedOrder) => {
    // Add all items to cart and navigate to checkout
    dispatch({
      type: 'SET_CART',
      payload: {
        items: order.cart,
        canteenId: order.canteenId,
        canteenName: order.canteenName
      }
    });
    router.push(`/user/checkout?canteenId=${order.canteenId}&canteenName=${order.canteenName}`);
  };

  const renderFavoriteItem = ({ item }: { item: SavedOrder }) => {
    // Calculate total items and price
    const totalItems = item.cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    const totalPrice = item.cart.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0);

    return (
      <View style={styles.favoriteCard}>
        <View style={styles.favoriteHeader}>
          <View style={styles.canteenInfo}>
            <Ionicons name="restaurant" size={16} color={theme.colors.primary} />
            <Text style={styles.canteenName}>{item.canteenName}</Text>
          </View>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order ID:</Text>
            <Text style={styles.orderId}>{item.orderId}</Text>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          {item.cart.map((cartItem, index) => (
            <View key={index} style={styles.cartItem}>
              {cartItem.image ? (
                <Image source={{ uri: cartItem.image }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, styles.placeholderImage]}>
                  <Ionicons name="fast-food-outline" size={24} color="#BDBDBD" />
                </View>
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{cartItem.name}</Text>
                <View style={styles.quantityPriceRow}>
                  <Text style={styles.itemQuantity}>Qty: {cartItem.quantity}</Text>
                  <Text style={styles.itemPrice}>Rs.{cartItem.price}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.orderSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Items:</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Price:</Text>
            <Text style={styles.summaryValue}>Rs.{totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="cart-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.orderAgainButton}
            onPress={() => handleOrderAgain(item)}
          >
            <Ionicons name="refresh-outline" size={18} color="white" />
            <Text style={styles.orderAgainText}>Order Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </SafeAreaView>
    );
  }

  // Empty state
  if (!savedOrders || savedOrders.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={80} color="#BDBDBD" />
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyDescription}>
          Your favorite orders will appear here when you save them
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/user/(tabs)')}
        >
          <Text style={styles.exploreButtonText}>Explore Canteens</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <FlatList
        data={savedOrders}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.favoritesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            {savedOrders.length} {savedOrders.length === 1 ? 'Favorite' : 'Favorites'}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 40,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  favoritesList: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  canteenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  canteenName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#757575',
    marginRight: 4,
  },
  orderId: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F9FAFC',
    borderRadius: 8,
    padding: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#757575',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  orderSummary: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 8,
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  addToCartText: {
    color: '#1976D2',
    fontWeight: '600',
    marginLeft: 6,
  },
  orderAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#1976D2',
  },
  orderAgainText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F7F9FC',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Favourites;