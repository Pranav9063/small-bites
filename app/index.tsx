import { useAuth } from '@/lib/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, Button, ActivityIndicator, Modal, ScrollView, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

type ItemType = {
  name: string,
  image: ImageSourcePropType | undefined,
  rating: number,
  id: string
}

const canteens = [
  { id: "1", name: "MiniCampus", rating: 4.9, image: require("@/assets/images/icon.jpg") },
  { id: "2", name: "Nescafe", rating: 4.8, image: require("@/assets/images/icon.jpg") },
  { id: "3", name: "HK-Cafe", rating: 4.6, image: require("@/assets/images/icon.jpg") },
  { id: "4", name: "Bittu", rating: 4.5, image: require("@/assets/images/icon.jpg") },
];

const Page: React.FC = () => {
  const { user, signOut } = useAuth();
  const styles = createStyles();

  const [sortedCanteens, setSortedCanteens] = useState([...canteens]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!selectedFilter) return;

    let updatedCanteens = [...canteens];

    if (selectedFilter === "⭐Ratings") {
      updatedCanteens.sort((a, b) => b.rating - a.rating);
    }

    setSortedCanteens(updatedCanteens);
  }, [selectedFilter]);

  const handleCanteenPress = useCallback((canteenName : string) => {
    console.log(`Selected Canteen: ${canteenName}`);
  }, []);

  const renderItem = ({ item } : {item: ItemType}) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCanteenPress(item.name)}>
      <Image source={item.image} style={styles.foodImage} />
      <Text style={styles.foodName}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFA500" />
        <Text style={styles.rating}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!appIsReady) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Small Bites</Text>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Image source={require("@/assets/images/food-app.png")} style={styles.profilePic} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput placeholder="Search" style={styles.searchInput} />
            <Ionicons name="filter" size={20} color="#666" />
          </View>

          {/* Scrollable Filter Buttons */}
          <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["⭐Ratings", "✅Open", "🔥Popular", "📍Nearby"].map((filter, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.filterButton, 
                    selectedFilter === filter && styles.activeFilter
                  ]} 
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[
    styles.filterText, 
    selectedFilter === filter && styles.activeFilterText
  ]}>
    {filter}
  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Canteen List */}
          <FlatList
            data={sortedCanteens}
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

          {/* Profile Dropdown Menu */}
          <Modal transparent={true} visible={menuVisible} animationType="fade">
            <View style={styles.overlay}>
              <View style={styles.menu}>
                <Text style={styles.menuText}>Hey, {user.user.name}</Text>
                <Text style={styles.menuText}>{user.user.email}</Text>
                <Button title="Sign Out" onPress={signOut} color="#d9534f" />
                <TouchableOpacity onPress={() => setMenuVisible(false)} style={{ marginTop: 10 }}>
                  <Text style={{ color: "#FA3C4C", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </SafeAreaView>
  );
};

export default Page;

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f78477",
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
      borderWidth: 2,
      borderColor: "white",
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
    filterWrapper: {
      flexDirection: "row",
      marginVertical: 10,
    },
    filterButton: {
      backgroundColor: "#ffffff",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      margin: 5,
      elevation: 2,
      alignItems: "center",
    },
    filterText: {
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: "#FA3C4C",
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
      borderRadius: 50,
    },
    foodName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    rating: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#FFA500",
      marginLeft: 5,
    },
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#f78477",
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
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    menu: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    menuText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 5,
      textAlign: "center",
    },
    activeFilter: {
      backgroundColor: "#FF4D4D",
      borderColor: "#FA3C4C",
    },
    activeFilterText: {
      color: "white",
    }
  });