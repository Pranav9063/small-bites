import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const orders = [
  { id: '1', name: '#143021', status: 'pending' },
  { id: '2', name: '#142501', status: 'preparing' },
  { id: '3', name: '#142009', status: 'ready' },
];

const OrdersScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push(`/canteen/orders/${item.id}`)}
          >
            <Text style={styles.orderText}>{item.name} - {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// **💡 Styles for Orders Screen**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
  },
});

export default OrdersScreen;
