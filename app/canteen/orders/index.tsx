import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../../context/OrderContext';

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

// Update orders array with items
const orders = [
  { 
    id: '1', 
    name: 'Order #143021', 
    status: 'pending',
    items: [
      { name: 'Burger', quantity: 2 },
      { name: 'Fries', quantity: 1 },
      { name: 'Soda', quantity: 2 }
    ]
  },
  { 
    id: '2', 
    name: 'Order #142501', 
    status: 'preparing',
    items: [
      { name: 'Pizza', quantity: 1 },
      { name: 'Coke', quantity: 2 }
    ]
  },
  { 
    id: '3', 
    name: 'Order #142009', 
    status: 'ready',
    items: [
      { name: 'Sandwich', quantity: 1 }
    ]
  },
];

const OrdersScreen = () => {
  const router = useRouter();
  const { orders } = useOrders();  // Get orders from context

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'preparing': return '#2196F3';
      case 'ready': return '#4CAF50';
      default: return '#999';
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/canteen/orders/${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderText}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsContainer}>
        {item.items.map((orderItem, index) => (
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
        data={orders}  // Use orders from context
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContainer}
      />
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