import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../lib/context/CartContext';
import { OrderDetails } from '@/assets/types/db';
import { useAuth } from '@/lib/context/AuthContext';
import { placeNewOrder } from '@/lib/services/realtime';
import { Theme } from '@/constants/Theme';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

type OrderTiming = {
  id: string;
  name: string;
  description?: string | null;
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
  const theme = useTheme();
  const styles = createStyles(theme);

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
      name: 'Collect Now'
    },
    {
      id: 'schedule',
      name: 'Schedule Collection',
      description: selectedTimeSlot && `Pickup at ${selectedTimeSlot.label}`
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary - Moved to top for better visibility */}
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
                <View style={[
                  styles.timingIcon,
                  selectedTiming === timing.id && styles.selectedTimingIcon
                ]}>
                  <Ionicons
                    name={timing.id === 'now' ? 'time-outline' : 'calendar-outline'}
                    size={24}
                    color={selectedTiming === timing.id ? "#FFFFFF" : theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    selectedTiming === timing.id && styles.selectedOptionText
                  ]}>{timing.name}</Text>
                  {selectedTiming == "schedule" && <Text style={styles.optionSubtitle}>{timing.description}</Text>}
                </View>
              </View>
              <View style={[
                styles.radioButton,
                selectedTiming === timing.id && styles.radioButtonSelected,
              ]}>
                {selectedTiming === timing.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
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
                <View style={[
                  styles.paymentIcon,
                  selectedPayment === method.id && styles.selectedPaymentIcon
                ]}>
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={selectedPayment === method.id ? "#FFFFFF" : theme.colors.primary}
                  />
                </View>
                <Text style={[
                  styles.optionTitle,
                  selectedPayment === method.id && styles.selectedOptionText
                ]}>
                  {method.name}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedPayment === method.id && styles.radioButtonSelected,
              ]}>
                {selectedPayment === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            (!selectedPayment || !selectedTiming || (selectedTiming === 'schedule' && !selectedTimeSlot)) && styles.disabledButton,
            isLoading && styles.loadingButton
          ]}
          onPress={handlePlaceOrder}
          disabled={!selectedPayment || !selectedTiming || (selectedTiming === 'schedule' && !selectedTimeSlot) || isLoading}
        >
          <Text style={styles.placeOrderText}>
            {isLoading ? 'Processing...' : 'Place Order'}
          </Text>
          {!isLoading && <Ionicons name="arrow-forward" size={20} color="white" />}
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
            <View style={styles.modalHandle} />
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

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F9FC", // Softer background color
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: "#FFFFFF",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: "#F0F4FF", // Light background for the back button
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1A1A1A",
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1A1A1A",
      marginBottom: 16,
      letterSpacing: 0.2,
    },
    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#E6E6E6",
    },
    selectedCard: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
      backgroundColor: "#F0F7FF", // Light blue background for selected cards
    },
    optionInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    timingIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#E3F2FD",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    selectedTimingIcon: {
      backgroundColor: theme.colors.primary,
    },
    paymentIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#E3F2FD",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    selectedPaymentIcon: {
      backgroundColor: theme.colors.primary,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1A1A1A",
    },
    selectedOptionText: {
      color: theme.colors.primary,
      fontWeight: "700",
    },
    optionSubtitle: {
      fontSize: 14,
      color: "#757575",
      marginTop: 4,
    },
    radioButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#E0E0E0",
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      borderColor: theme.colors.primary,
    },
    radioButtonInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
    },
    summaryCard: {
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E6E6E6",
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 15,
      color: "#757575",
    },
    summaryValue: {
      fontSize: 15,
      fontWeight: "600",
      color: "#1A1A1A",
    },
    totalRow: {
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#EEEEEE",
      marginBottom: 0,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1A1A1A",
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.primary,
    },
    footer: {
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor: "#EEEEEE",
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    placeOrderButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 30,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    disabledButton: {
      backgroundColor: "#BDBDBD",
      shadowOpacity: 0.1,
    },
    loadingButton: {
      backgroundColor: theme.colors.primary,
      opacity: 0.8,
    },
    placeOrderText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
      marginRight: 8,
      letterSpacing: 0.5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingTop: 12,
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: "#E0E0E0",
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 16,
    },
    modalHeader: {
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1A1A1A",
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: "#757575",
    },
    modalCloseButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 30,
      alignItems: "center",
      marginTop: 20,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    modalCloseButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    timeSlotList: {
      paddingHorizontal: 8,
    },
    timeSlot: {
      flex: 1,
      margin: 8,
      padding: 16,
      backgroundColor: "#F0F4FF",
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#E6E6E6",
    },
    selectedTimeSlot: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    timeSlotText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#1A1A1A",
    },
    selectedTimeSlotText: {
      color: "#FFFFFF",
    },
  });
  return styles;
}