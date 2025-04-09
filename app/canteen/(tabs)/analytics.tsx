import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const salesData = [
  { id: "1", name: "Burger", price: 80, sold: 35, revenue: 2800, image: require("@/assets/images/canteenImg.png") },
  { id: "2", name: "Fries", price: 100, sold: 25, revenue: 2500, image: require("@/assets/images/canteenImg.png") },
  { id: "3", name: "Pizza", price: 200, sold: 20, revenue: 4000, image: require("@/assets/images/canteenImg.png") },
  { id: "4", name: "Soda", price: 40, sold: 40, revenue: 1600, image: require("@/assets/images/canteenImg.png") },
];

const HistoryScreen = () => {
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSold = salesData.reduce((sum, item) => sum + item.sold, 0);
  const bestSeller = salesData.reduce((prev, current) =>
    prev.sold > current.sold ? prev : current
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="cash-outline" size={24} color="white" />
            <Text style={styles.summaryTitle}>Total Revenue</Text>
            <Text style={styles.summaryValue}>₹{totalRevenue}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="cart-outline" size={24} color="white" />
            <Text style={styles.summaryTitle}>Items Sold</Text>
            <Text style={styles.summaryValue}>{totalSold}</Text>
          </View>
        </View>

        {/* Best Seller Card */}
        <View style={styles.bestSellerCard}>
          <View style={styles.bestSellerHeader}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.bestSellerTitle}>Best Seller</Text>
          </View>
          <Text style={styles.bestSellerName}>{bestSeller.name}</Text>
          <Text style={styles.bestSellerSold}>{bestSeller.sold} units sold</Text>
        </View>

        {/* Sales Breakdown */}
        <View style={styles.salesContainer}>
          <Text style={styles.sectionTitle}>Sales Breakdown</Text>
          {salesData.map((item) => (
            <View key={item.id} style={styles.salesItem}>
              <View style={styles.salesInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSold}>{item.sold} sold</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${(item.sold / bestSeller.sold) * 100}%`,
                      backgroundColor: getProgressColor(item.sold / bestSeller.sold)
                    }
                  ]}
                />
              </View>
              <Text style={styles.itemRevenue}>₹{item.revenue}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const getProgressColor = (ratio: number) => {
  if (ratio > 0.8) return '#4CAF50';
  if (ratio > 0.5) return '#2196F3';
  if (ratio > 0.3) return '#FFC107';
  return '#FF5722';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
  },
  summaryValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bestSellerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bestSellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bestSellerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  bestSellerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bestSellerSold: {
    fontSize: 16,
    color: '#666',
  },
  salesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  salesItem: {
    marginBottom: 16,
  },
  salesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  itemSold: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  itemRevenue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default HistoryScreen;
