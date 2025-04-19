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
    const [isGridLayout, setIsGridLayout] = useState(false);
    const [favorites, setFavorites] = useState<{[key: string]: boolean}>({});

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

    const toggleLayout = () => {
        setIsGridLayout(!isGridLayout);
    };

    const toggleFavorite = useCallback((id: string) => {
        setFavorites(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    const renderItem = ({ item }: { item: CanteenData }) => (
        <TouchableOpacity 
            style={[styles.card, isGridLayout && styles.gridCard]} 
            onPress={() => handleCanteenPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image 
                    source={item.image ? { uri: item.image } : require('@/assets/images/canteenImg.png')} 
                    style={styles.foodImage} 
                    resizeMode="cover"
                />
                <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(item.id)}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name={favorites[item.id] ? "heart" : "heart-outline"} 
                        size={20} 
                        color={favorites[item.id] ? "#FF3B30" : "#666"} 
                    />
                </TouchableOpacity>
            </View>
            
            <View style={styles.cardContent}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.foodName, isGridLayout && styles.gridFoodName]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.rating}>{item.rating?.toFixed(1) || 'N/A'}</Text>
                    </View>
                </View>

                {!isGridLayout ? (
                    <View style={styles.infoContainer}>
                        <View style={styles.bottomRow}>
                            <View style={styles.locationContainer}>
                                <Ionicons name="location-outline" size={14} color="#666" />
                                <Text style={styles.infoText} numberOfLines={1}>
                                    {item.location || 'Location N/A'}
                                </Text>
                            </View>
                            <View style={styles.timeContainer}>
                                <Ionicons name="time-outline" size={14} color="#666" />
                                <Text style={styles.timeText}>
                                    {item.timings ? 
                                        `${item.timings.open} - ${item.timings.close}` : 
                                        'Timings N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.footerRow}>
                        <View style={styles.gridLocationContainer}>
                            <Ionicons name="location-outline" size={12} color="#666" />
                            <Text style={styles.gridLocationText} numberOfLines={1}>
                                {item.location || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.gridTimeContainer}>
                            <Ionicons name="time-outline" size={12} color="#666" />
                            <Text style={styles.gridTimeText}>
                                {item.timings ? item.timings.open : '--:--'}
                            </Text>
                        </View>
                    </View>
                )}
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
                            <TouchableOpacity style={styles.filterButton} onPress={toggleLayout}>
                                <Ionicons 
                                    name={isGridLayout ? "list-outline" : "grid-outline"} 
                                    size={24} 
                                    color="white" 
                                />
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
                        numColumns={isGridLayout ? 2 : 1}
                        key={isGridLayout ? 'grid' : 'list'}
                        contentContainerStyle={[
                            styles.menuList,
                            isGridLayout && styles.gridList
                        ]}
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
        card: {
            backgroundColor: 'white',
            borderRadius: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
            overflow: 'hidden',
            height: 340, // Increased overall height
        },
        gridCard: {
            width: '48%',
            marginHorizontal: '1%',
            height: 260, // Increased grid card height
            marginBottom: 12,
        },
        imageContainer: {
            width: '100%',
            height: '65%', // Image takes 70%
            position: 'relative',
            backgroundColor: '#f0f0f0', // Placeholder color
        },
        foodImage: {
            width: '100%',
            height: '100%',
        },
        badgeContainer: {
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
        },
        statusBadge: {
            backgroundColor: 'rgba(46, 204, 113, 0.9)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        statusText: {
            color: 'white',
            fontSize: 12,
            fontWeight: '600',
        },
        cardContent: {
            padding: 16,
            height: '35%',
            justifyContent: 'space-between',
        },
        gridTimeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            paddingBottom: 12,
        },
        gridTimeText: {
            fontSize: 11,
            color: '#666',
            flex: 1,
        },
        titleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        foodName: {
            fontSize: 16,
            fontWeight: '700',
            color: '#1a1a1a',
            flex: 1,
            marginRight: 8,
        },
        gridFoodName: {
            fontSize: 14,
            marginBottom: 4,
        },
        infoContainer: {
            flex: 1,
            justifyContent: 'space-between',
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
            flex: 1,
        },
        timeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'flex-end',
            paddingBottom: 8,
            justifyContent: 'flex-end',
            flex: 1,
        },
        infoText: {
            fontSize: 13,
            color: '#666',
            flex: 1,
        },
        timeText: {
            fontSize: 13,
            color: '#666',
        },
        footerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingBottom: 16, // Increased bottom padding
        },
        gridLocationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: 4,
        },
        gridLocationText: {
            fontSize: 11,
            color: '#666',
            flex: 1,
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFF9E6',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#FFE4B5',
        },
        rating: {
            fontSize: 13,
            fontWeight: '700',
            color: '#FFB100',
            marginLeft: 4,
        },
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
            padding: 8,
        },
        gridList: {
            paddingHorizontal: 8,
            alignItems: 'stretch',
        },
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        bottomRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingVertical: 8,
        },
        favoriteButton: {
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            padding: 4,
        },
    });
export default UserHomeScreen;
