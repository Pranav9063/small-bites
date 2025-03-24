import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const OrderDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  
  // Mock order data - in a real app, you'd fetch this based on the id
  const orderItems: OrderItem[] = [
    { id: 1, name: "Burger", quantity: 2, price: 10.99 },
    { id: 2, name: "Fries", quantity: 1, price: 4.99 },
    { id: 3, name: "Soda", quantity: 2, price: 2.99 },
  ];

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order #{id}</Text>
        <Text style={styles.statusText}>Status: Processing</Text>
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {orderItems.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
      </View>

      <View style={styles.deliveryInfo}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        <Text style={styles.deliveryText}>Estimated Time: 30-45 minutes</Text>
        <Text style={styles.deliveryText}>Delivery Location: Campus Center</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  itemsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    marginRight: 8,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#eee',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  deliveryInfo: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
});

export default OrderDetail;
