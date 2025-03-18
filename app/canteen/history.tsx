import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

const salesData = [
  { id: "1", name: "Chicken Burger", price: "30Rs", sold: 35, image: require("@/assets/images/canteenImg.png") },
  { id: "2", name: "Royal Foods", price: "50Rs", sold: 25, image: require("@/assets/images/canteenImg.png") },
  { id: "3", name: "Asia Foods Restaurant", price: "40Rs", sold: 40, image: require("@/assets/images/canteenImg.png") },
  { id: "4", name: "Hirosima Restaurant", price: "60Rs", sold: 20, image: require("@/assets/images/canteenImg.png") },
];

const HistoryScreen = () => {
  const [sales, setSales] = useState(salesData);

  const totalSold = sales.reduce((total, item) => total + item.sold, 0);
  const totalRevenue = sales.reduce((total, item) => total + parseInt(item.price) * item.sold, 0);

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.header}>
        <Text style={[styles.tab, styles.inactiveTab]}>Ongoing</Text>
        <Text style={[styles.tab, styles.activeTab]}>History</Text>
        <Text style={[styles.tab, styles.inactiveTab]}>Draft</Text>
      </View>

      {/* Order List */}
      <FlatList
        data={sales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            <Text style={styles.itemUnits}>{item.sold} Units</Text>
          </View>
        )}
      />

      {/* Total Section */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Sold:</Text>
        <Text style={styles.totalCount}>{totalSold} Units</Text>
        <Text style={styles.totalRevenue}>Total Revenue: ₹{totalRevenue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeTab: {
    color: "#ff6600",
    borderBottomWidth: 2,
    borderBottomColor: "#ff6600",
    paddingBottom: 5,
  },
  inactiveTab: {
    color: "#888",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#888",
  },
  itemUnits: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#ff6600",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 15,
  },
  totalText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  totalCount: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
  },
  totalRevenue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default HistoryScreen;
