import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../lib/context/CartContext';
import type { CartItem } from '../../lib/context/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen({ id, name }: { id: string, name: string }) {
  const { cart, dispatch } = useCart();
  const router = useRouter();

  // console.log("Cart data:", cart); // Debugging: Log cart data to verify image URLs

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, delta } });
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={
          item.image
            ? { uri: item.image } // Use the image URL if available
            : require('../../assets/images/canteenImg.png') // Fallback to a default image
        }
        style={styles.itemImage}
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => handleRemoveItem(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={18} color="#757575" />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>

        <View style={styles.itemActions}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => handleUpdateQuantity(item.id, -1)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={18} color="#1976D2" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => handleUpdateQuantity(item.id, 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={18} color="#1976D2" />
            </TouchableOpacity>
          </View>
          <Text style={styles.itemTotalPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.title}>My Cart</Text>
        <View style={styles.placeholder} />
      </View>

      {cart.length > 0 ? (
        <>
          {/* <View style={styles.canteenInfo}>
            <Ionicons name="restaurant" size={20} color="#1976D2" />
            <Text style={styles.canteenName}>{name}</Text>
          </View> */}

          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
              </View>

              <View style={[styles.totalRow, styles.finalTotal]}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>₹{(totalAmount).toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push({
                pathname: '/user/checkout', params: {
                  canteenId: id,
                  canteenName: name
                }
              })}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIconContainer}>
            <Ionicons name="cart-outline" size={80} color="#1976D2" />
          </View>
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateText}>
            Looks like you haven't added anything to your cart yet
          </Text>
          <TouchableOpacity
            style={styles.startShoppingButton}
            onPress={() => router.back()}
          >
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  placeholder: {
    width: 40,
  },
  canteenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  canteenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  listContent: {
    padding: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  quantity: {
    width: 36,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalSection: {
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#757575',
  },
  totalValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  checkoutButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
  },
  startShoppingButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startShoppingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});