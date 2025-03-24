import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const mockOrderItems = [
    {
      id: 1,
      name: 'Ultimate Pepperoni',
      price: 12.99,
      size: 'M',
      quantity: 2,
      image: require('@/assets/images/menuItems/burger.jpg'),
    },
    {
      id: 2,
      name: 'ExtravaganzZa',
      price: 14.99,
      size: 'L',
      quantity: 1,
      image: require('@/assets/images/menuItems/burger.jpg'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Orders</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{id}</Text>
      </View>

      <ScrollView>
        <View style={styles.orderStatus}>
          <Text style={styles.statusText}>Cooking</Text>
          <Text style={styles.timeText}>an hour ago</Text>
        </View>

        {/* Order Items */}
        {mockOrderItems.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSize}>Size: {item.size}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <Text style={styles.quantity}>{item.quantity}</Text>
          </View>
        ))}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept (5:00)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 40,
  },
  orderStatus: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4D4D',
    alignItems: 'center',
  },
  acceptButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FF4D4D',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
