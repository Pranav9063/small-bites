import { useAuth } from '@/lib/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { Link, useRouter } from 'expo-router';
import { fetchAllCanteens } from '@/lib/services/firestoreService';
import { CanteenData } from '@/assets/types/db';

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
    const { user, signOutUser } = useAuth();
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

    useEffect(() => {
        const fetchCanteens = async () => {
            try {
                const fetchedCanteens = await fetchAllCanteens() as CanteenData[];
                if (!fetchedCanteens) {
                    console.error("No canteens found");
                    return;
                }
                console.log(fetchedCanteens)
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
            <Image 
                source={item.image ? { uri: item.image } : require('@/assets/images/canteenImg.png')} 
                style={styles.foodImage} 
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>N/A</Text>
                    </View>
                </View>
                <Text style={styles.description}>Traditional Campus Dining</Text>
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
                        numColumns={1}
                        contentContainerStyle={styles.menuList}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Profile Dropdown Menu */}
                    <Modal transparent={true} visible={menuVisible} animationType="fade">
                        <View style={styles.overlay}>
                            <View style={styles.menu}>
                                <Text style={styles.menuText}>Hey, {user.displayName}</Text>
                                <Text style={styles.menuText}>{user.email}</Text>
                                <TouchableOpacity
                                    style={styles.signOutButton}
                                    onPress={signOutUser}
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
        card: {
            backgroundColor: "white",
            borderRadius: 24,
            width: '100%',
            marginBottom: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
            flexDirection: 'row',
            height: 120,
        },
        foodImage: {
            width: 120,
            height: '100%',
        },
        cardContent: {
            flex: 1,
            padding: 12,
            justifyContent: 'center',
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        foodName: {
            fontSize: 18,
            fontWeight: "700",
            color: "#333",
            flex: 1,
        },
        description: {
            fontSize: 13,
            color: '#666',
        },
        ratingContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: '#FFF9E6',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            marginLeft: 8,
        },
        rating: {
            marginLeft: 4,
            fontSize: 14,
            fontWeight: "600",
            color: "#333",
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

