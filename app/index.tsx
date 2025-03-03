import SettingsScreen from '@/components/screens/SettingsScreen';
import { Theme } from '@/constants/Theme';
import { useAuth } from '@/lib/context/AuthContext';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, Button, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Page: React.FC = () => {
  const { user, signOut } = useAuth();
  const theme = useTheme(); 
  const styles = createStyles(theme);

  const canteens = [
    { id: "1", name: "MiniCampus", rating: 4.9, image: require("@/assets/images/icon.jpg") },
    { id: "2", name: "Nescafe", rating: 4.8, image: require("@/assets/images/icon.jpg") },
    { id: "3", name: "HK-Cafe", rating: 4.6, image: require("@/assets/images/icon.jpg") },
    { id: "4", name: "Bittu", rating: 4.5, image: require("@/assets/images/icon.jpg") },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.foodImage} />
      <Text style={styles.foodName}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFA500" />
        <Text style={styles.rating}>{item.rating}</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Small Bites</Text>
            <Image source={require("@/assets/images/food-app.png")} style={styles.profilePic} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput placeholder="Search" style={styles.searchInput} />
            <Ionicons name="filter" size={20} color="#666" />
          </View>

          {/* Welcome Text & Sign Out Button */}
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome, {user.user.name}!</Text>
            <Text style={styles.infoText}>Email: {user.user.email}</Text>
            <Button title="Sign Out" onPress={signOut} color="#d9534f" />
          </View>

          {/* Food Items Grid */}
          <FlatList
            data={canteens}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <Ionicons name="home" size={30} color="white" />
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
            <Ionicons name="settings" size={30} color="white" />
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </SafeAreaView>
  );
};

export default Page;

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FA3C4C", 
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 10,
    },
    logo: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
      marginHorizontal: 20,
      marginTop: 10,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
    },
    userInfo: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 10,
      margin: 20,
      alignItems: "center",
    },
    welcomeText: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 5,
      color: "#333",
    },
    infoText: {
      fontSize: 16,
      color: "#666",
      marginBottom: 10,
    },
    row: {
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: "white",
      borderRadius: 15,
      padding: 10,
      marginVertical: 10,
      width: "48%",
      alignItems: "center",
    },
    foodImage: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    foodName: {
      fontWeight: "bold",
      fontSize: 14,
      textAlign: "center",
    },
    restaurant: {
      fontSize: 12,
      color: "#666",
      textAlign: "center",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 5,
    },
    rating: {
      fontSize: 14,
      fontWeight: "bold",
      marginLeft: 5,
    },
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#FA3C4C",
      paddingVertical: 10,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    addButton: {
      backgroundColor: "#FF4D4D",
      borderRadius: 30,
      padding: 10,
    },
  });
