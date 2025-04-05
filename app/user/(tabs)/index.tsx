import { useAuth } from '@/lib/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { Link, useRouter } from 'expo-router';
import { fetchAllCanteens } from '@/lib/services/firestoreService';

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
    { id: "4", name: "Bittu", rating: 4.7, image: require("@/assets/images/icon.jpg") },
];

const UserHomeScreen = () => {
    const { user, signOut } = useAuth();
    const styles = createStyles();
    const router = useRouter();

    const [sortedCanteens, setSortedCanteens] = useState<CanteenData[]>();
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [appIsReady, setAppIsReady] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    // useEffect(() => {
    //     if (!selectedFilter) return;

    //     let updatedCanteens = [...canteens];


    //     if (selectedFilter === "⭐Ratings") {
    //         updatedCanteens.sort((a, b) => b.rating - a.rating);
    //     }

    //     setSortedCanteens(updatedCanteens);
    // }, [selectedFilter]);

    // useEffect(() => {
    //     let updatedCanteens = [...canteens];

    //     if (searchQuery) {
    //         updatedCanteens = updatedCanteens.filter(canteen =>
    //             canteen.name.toLowerCase().includes(searchQuery.toLowerCase())
    //         );
    //     }

    //     setSortedCanteens(updatedCanteens);
    // }, [selectedFilter, searchQuery]);

    useEffect(() => {
        const fetchCanteens = async () => {
            try {
                const fetchedCanteens = await fetchAllCanteens() as CanteenData[];
                if (!fetchedCanteens) {
                    console.error("No canteens found");
                    return;
                }
                setSortedCanteens(fetchedCanteens);
            } catch (error) {
                console.error("Error fetching canteens:", error);
            }
        };

        fetchCanteens();
    }, []);

    const handleCanteenPress = useCallback((canteen: CanteenData) => {
        router.push({
            pathname: "/user/canteen/[id]",
            params: { id: canteen.id, name: canteen.name },
        });
    }, [router]);

    const renderItem = ({ item }: { item: CanteenData }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleCanteenPress(item)}>
            <Image source={item.image ? { uri: item.image } : require('@/assets/images/canteenImg.png')} style={styles.foodImage} />
            <View style={styles.imageOverlay} />
            <View style={styles.cardContent}>
                <Text style={styles.foodName}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>N/A</Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    if (!appIsReady) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <Link href="/user">Click me!</Link> */}
            {user ? (
                <>
                    {/* Fixed Header */}
                    <View style={styles.fixedHeader}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.logo}>Small Bites</Text>
                            <TouchableOpacity
                                style={styles.profileButton}
                                onPress={() => setMenuVisible(true)}
                            >
                                <Image source={user?.photoURL ? { uri: user?.photoURL } : require('@/assets/images/canteenImg.png')} style={styles.profilePic} />
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <View style={styles.searchInputContainer}>
                                <Ionicons name="search" size={20} color="#666" />
                                <TextInput
                                    placeholder="Search canteens..."
                                    style={styles.searchInput}
                                    placeholderTextColor="#999"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>
                            <TouchableOpacity style={styles.filterButton}>
                                <Ionicons name="options" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Scrollable Filter Buttons */}
                        <View style={styles.categoriesContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {["⭐Ratings", "✅Open", "🔥Popular", "📍Nearby"].map((filter, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.categoryButton,
                                            selectedFilter === filter && styles.selectedCategory
                                        ]}
                                        onPress={() => setSelectedFilter(filter)}
                                    >
                                        <Text style={[
                                            styles.categoryText,
                                            selectedFilter === filter && styles.selectedCategoryText
                                        ]}>
                                            {filter}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Canteen List */}
                    <FlatList
                        data={sortedCanteens}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.menuList}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Bottom Navigation */}
                    {/* <View style={styles.bottomNav}>
                        <TouchableOpacity style={styles.navItem}>
                            <Ionicons name="home" size={24} color="#007AFF" />
                            <Text style={[styles.navText, { color: '#007AFF' }]}>Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem}>
                            <Ionicons name="heart-outline" size={24} color="#666" />
                            <Text style={styles.navText}>Favorites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.centerButton, styles.centerButtonGradient]}>
                            <Ionicons name="grid" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.navItem}
                            onPress={() => router.push('/user/expenses')}
                        >
                            <Ionicons name="cash-outline" size={24} color="#666" />
                            <Text style={styles.navText}>Expenses</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => router.push('/user/profile')}
                        >
                            <Ionicons name="person-outline" size={24} color="#666" />
                            <Text style={styles.navText}>Profile</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* Profile Dropdown Menu */}
                    <Modal transparent={true} visible={menuVisible} animationType="fade">
                        <View style={styles.overlay}>
                            <View style={styles.menu}>
                                <Text style={styles.menuText}>Hey, {user.displayName}</Text>
                                <Text style={styles.menuText}>{user.email}</Text>
                                <TouchableOpacity
                                    style={styles.signOutButton}
                                    onPress={signOut}
                                >
                                    <Text style={styles.signOutText}>Sign Out</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setMenuVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
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

const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        fixedHeader: {
            backgroundColor: '#fff',
            paddingTop: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
            zIndex: 1,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        logo: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#333",
        },
        profileButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f5f5f5',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        profilePic: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 16,
            gap: 12,
        },
        searchInputContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 16,
        },
        searchInput: {
            flex: 1,
            marginLeft: 12,
            fontSize: 16,
            color: '#333',
        },
        filterButton: {
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#007AFF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        categoriesContainer: {
            paddingBottom: 16,
        },
        categoryButton: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: '#f5f5f5',
            marginHorizontal: 8,
        },
        selectedCategory: {
            backgroundColor: '#007AFF',
        },
        categoryText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#666',
        },
        selectedCategoryText: {
            color: '#333',
        },
        menuList: {
            padding: 16,
            paddingTop: 16,
        },
        row: {
            justifyContent: "space-between",
        },
        card: {
            backgroundColor: "white",
            borderRadius: 20,
            width: "48%",
            marginBottom: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        foodImage: {
            width: '100%',
            height: 120,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        imageOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            backgroundColor: 'rgba(0,0,0,0.2)',
        },
        cardContent: {
            padding: 12,
        },
        foodName: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
        },
        ratingContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: '#FFF9E6',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            alignSelf: 'flex-start',
        },
        rating: {
            marginLeft: 4,
            fontSize: 14,
            fontWeight: "600",
            color: "#333",
        },
        bottomNav: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "#fff",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
        },
        navItem: {
            alignItems: "center",
        },
        navText: {
            fontSize: 12,
            color: "#666",
            marginTop: 4,
        },
        centerButton: {
            marginTop: -30,
        },
        centerButtonGradient: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#007AFF",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
        },
        overlay: {
            flex: 1,
            backgroundColor: "#007AFF",
            justifyContent: "center",
            alignItems: "center",
        },
        menu: {
            backgroundColor: "white",
            padding: 24,
            borderRadius: 20,
            width: "80%",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        menuText: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
            textAlign: "center",
        },
        signOutButton: {
            backgroundColor: '#007AFF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            marginTop: 16,
            width: '100%',
        },
        signOutText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        closeButton: {
            marginTop: 16,
            paddingVertical: 8,
        },
        closeButtonText: {
            color: '#666',
            fontSize: 16,
            fontWeight: '600',
        },
    });

export default UserHomeScreen;

