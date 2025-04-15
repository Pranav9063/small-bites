import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../lib/context/CartContext';
import { OrderDetails } from '@/assets/types/db';
import { useAuth } from '@/lib/context/AuthContext';
import { placeNewOrder } from '@/lib/services/realtime';

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

type OrderTiming = {
  id: string;
  name: string;
  description: string;
};

type TimeSlot = {
  id: string;
  time: string;
  label: string;
};

export default function CheckoutScreen({ canteenId, canteenName }: { canteenId: string, canteenName: string }) {
  const router = useRouter();
  const { cart, dispatch } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [selectedTiming, setSelectedTiming] = useState<string>('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 10; hour < 22; hour++) {
      const time24 = `${hour}:00`;
      const timeLabel = hour < 12 ? `${hour}:00 AM` :
        hour === 12 ? `12:00 PM` :
          `${hour - 12}:00 PM`;
      slots.push({
        id: time24,
        time: time24,
        label: timeLabel
      });

      // Add half-hour slots
      const halfHour = `${hour}:30`;
      const halfHourLabel = hour < 12 ? `${hour}:30 AM` :
        hour === 12 ? `12:30 PM` :
          `${hour - 12}:30 PM`;
      slots.push({
        id: halfHour,
        time: halfHour,
        label: halfHourLabel
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
    { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
  ];

  const orderTimings: OrderTiming[] = [
    {
      id: 'now',
      name: 'Collect Now',
      description: 'Your order will be ready in 15-20 minutes'
    },
    {
      id: 'schedule',
      name: 'Schedule Collection',
      description: selectedTimeSlot
        ? `Pickup at ${selectedTimeSlot.label}`
        : 'Pick up your order at your preferred time'
    },
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      if (!selectedPayment || !selectedTiming) {
        // Show error message
        return;
      }
      if (selectedTiming === 'schedule' && !selectedTimeSlot) {
        // Show error message for missing scheduled time
        return;
      }
      if (selectedPayment != 'cash') {
        Alert.alert("Please proceed with Cash on Delivery only.");
        return;
      }
      // Handle order placement
      const orderDetails = {
        userId: user?.uid,
        orderStatus: 'pending',
        canteenId,
        canteenName,
        cart,
        paymentMethod: selectedPayment,
        scheduledTime: selectedTiming === 'schedule' ? new Date(`${new Date().toISOString().split('T')[0]}T${selectedTimeSlot?.time}:00`) : new Date(),
      } as OrderDetails;

      // Call the function to place the order
      await placeNewOrder(orderDetails);
      // Clear the cart 
      cart.forEach((item) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
      })

      Alert.alert("Order placed successfully!")
      router.push('/user/orders');
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimingSelect = (timingId: string) => {
    setSelectedTiming(timingId);
    if (timingId === 'schedule') {
      setShowTimePicker(true);
    }
  };

  const renderTimeSlot = ({ item }: { item: TimeSlot }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        selectedTimeSlot?.id === item.id && styles.selectedTimeSlot
      ]}
      onPress={() => {
        setSelectedTimeSlot(item);
        setShowTimePicker(false);
      }}
    >
      <Text style={[
        styles.timeSlotText,
        selectedTimeSlot?.id === item.id && styles.selectedTimeSlotText
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Collection Timing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection Time</Text>
          {orderTimings.map((timing) => (
            <TouchableOpacity
              key={timing.id}
              style={[
                styles.optionCard,
                selectedTiming === timing.id && styles.selectedCard,
              ]}
              onPress={() => handleTimingSelect(timing.id)}
            >
              <View style={styles.optionInfo}>
                <View style={styles.timingIcon}>
                  <Ionicons
                    name={timing.id === 'now' ? 'time-outline' : 'calendar-outline'}
                    size={24}
                    color="#1976D2" // Updated icon color
                  />
                </View>
                <View>
                  <Text style={styles.optionTitle}>{timing.name}</Text>
                  <Text style={styles.optionSubtitle}>{timing.description}</Text>
                </View>
              </View>
              <View style={[
                styles.radioButton,
                selectedTiming === timing.id && styles.radioButtonSelected,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.optionCard,
                selectedPayment === method.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.optionInfo}>
                <Ionicons name={method.icon as any} size={24} color="#333" />
                <Text style={[styles.optionTitle, { marginLeft: 12 }]}>
                  {method.name}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedPayment === method.id && styles.radioButtonSelected,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs.{subtotal.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>Rs.{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            (!selectedPayment || !selectedTiming || (selectedTiming === 'schedule' && !selectedTimeSlot)) && styles.disabledButton,
          ]}
          onPress={handlePlaceOrder}
          disabled={!selectedPayment || !selectedTiming || (selectedTiming === 'schedule' && !selectedTimeSlot)}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Time Slots Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Pickup Time</Text>
              <Text style={styles.modalSubtitle}>Choose your preferred pickup time</Text>
            </View>
            <FlatList
              data={timeSlots}
              renderItem={renderTimeSlot}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.timeSlotList}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7", // Updated background color
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE", // Updated border color
    backgroundColor: "#FFFFFF", // Updated header background
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F3F4", // Updated button background
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121", // Updated text color
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE", // Updated border color
    backgroundColor: "#FFFFFF", // Updated section background
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121", // Updated text color
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: "#1976D2", // Updated selection color
    borderWidth: 2,
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD", // Updated icon background
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121", // Updated text color
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#757575", // Updated text color
    marginTop: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0", // Updated border color
  },
  radioButtonSelected: {
    borderColor: "#1976D2", // Updated selection color
    backgroundColor: "#1976D2",
  },
  summaryCard: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#757575", // Updated text color
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121", // Updated text color
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE", // Updated border color
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121", // Updated text color
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976D2", // Updated highlight color
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE", // Updated border color
    backgroundColor: "#FFFFFF", // Updated footer background
  },
  placeOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976D2", // Updated button color
    padding: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0", // Updated disabled button color
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // Updated text color
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF", // Updated modal background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121", // Updated text color
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#757575", // Updated text color
  },
  modalCloseButton: {
    backgroundColor: "#F1F3F4", // Updated button background
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121", // Updated text color
  },
  timeSlotList: {
    paddingHorizontal: 8,
  },
  timeSlot: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#F1F3F4", // Updated background color
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "#1976D2", // Updated selection color
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121", // Updated text color
  },
  selectedTimeSlotText: {
    color: "#FFFFFF", // Updated text color
  },
});