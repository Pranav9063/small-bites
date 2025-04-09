import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../../../context/OrderContext';
import { useAuth } from '@/lib/context/AuthContext';
import { OrderDetails } from '@/assets/types/db';
import { CartItem } from '@/lib/context/CartContext';
import { getCanteenOrders } from '@/lib/services/realtime';

// Add interface for order items
interface OrderItem {
  name: string;
  quantity: number;
}

// Add interface for Order type
interface Order {
  id: string;
  name: string;
  status: 'pending' | 'preparing' | 'ready';
  items: OrderItem[];
}

const OrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getCanteenOrders(user!.uid);
      setOrders(orders);
    };
    fetchOrders();
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'preparing': return '#2196F3';
      case 'ready': return '#4CAF50';
      case 'cancelled': return '#F44336';
      case 'completed': return '#9E9E9E';
      default: return '#999';
    }
  };

  const renderOrderCard = ({ item: order }: { item: OrderDetails }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/canteen/orders/${order.orderId}`)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderText}>{`Order ${order.orderId}`}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) }]}>
            <Text style={styles.statusText}>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsContainer}>
        {order.cart.map((orderItem, index) => (
          <View key={index} style={styles.itemRow}>
            <Ionicons name="restaurant-outline" size={16} color="#666" />
            <Text style={styles.orderItemText}>
              {orderItem.name} × {orderItem.quantity}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders} // Ensure orders is always an array
        keyExtractor={(item) => item.orderId}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContainer}
      />
      <Pressable style={{ padding: 16 }} onPress={() => router.push('/user/profile')}>
        <Text>Profile</Text>
      </Pressable>
    </SafeAreaView>
  );
};

// **💡 Styles for Orders Screen**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  itemsContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderItemText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
});

export default OrdersScreen;