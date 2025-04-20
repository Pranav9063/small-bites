import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { OrderDetails } from '@/assets/types/db';
import { updateOrderStatus } from '@/lib/services/realtime';
import { database } from '@/lib/services/firebaseConfig';
import { ref, onValue } from '@react-native-firebase/database';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'cancelled' | 'completed';

const OrderDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [currentOrder, setCurrentOrder] = React.useState<OrderDetails>();
  const statusSteps: OrderStatus[] = ['pending', 'preparing', 'ready'];

  useEffect(() => {
    if (!id) return;

    const orderRef = ref(database, `orders/${id}`);

    const unsubscribe = onValue(orderRef, (snapshot) => {
      const orderData = snapshot.val();
      if (orderData) {
        setCurrentOrder(orderData);
      } else {
        console.error("Order not found");
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [id]);

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

  if (!currentOrder) {
    return <Text>Order not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order #{id}</Text>
      </View>

      {/* Status Slider */}
      <View style={styles.statusContainer}>
        <View style={styles.statusTrack}>
          {statusSteps.map((status, index) => (
            <React.Fragment key={status}>
              {index > 0 && <View style={[
                styles.statusLine,
                { backgroundColor: currentOrder.orderStatus === 'pending' ? '#eee' : getStatusColor(currentOrder.orderStatus) }
              ]} />}
              <TouchableOpacity
                onPress={() => updateOrderStatus(id as string, status)}
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: statusSteps.indexOf(currentOrder.orderStatus) >= index
                      ? getStatusColor(status)
                      : '#eee'
                  }
                ]}
              >
                <Text style={styles.statusLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {currentOrder.cart.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>₹{item.quantity * 100}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>₹{currentOrder.cart.reduce((sum, item) => sum + item.quantity * 100, 0)}</Text>
      </View>

      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryText}>Estimated Time: 30-45 minutes</Text>
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
  statusContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  statusTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  statusLine: {
    height: 3,
    flex: 1,
    backgroundColor: '#eee',
    marginHorizontal: -10,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  statusLabel: {
    position: 'absolute',
    top: 30,
    fontSize: 12,
    color: '#666',
    width: 80,
    textAlign: 'center',
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
