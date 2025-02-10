import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/context/AuthContext';

const canteens = [
    { id: '1', name: 'MiniCampus', image: require('@/assets/images/canteenImg.png') },
    { id: '2', name: 'Nescafe', image: require('@/assets/images/canteenImg.png') },
    { id: '3', name: 'HK Cafe', image: require('@/assets/images/canteenImg.png') },
    { id: '4', name: 'Bittu', image: require('@/assets/images/canteenImg.png') },
];

export default function Home() {
    const { user, signOut } = useAuth();
    const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleCanteenSelection = (canteen: string) => {
        setSelectedCanteen(canteen);
    };

    const renderCanteenItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                style={[styles.canteenButton, selectedCanteen === item.name && styles.selectedCanteen]}
                onPress={() => handleCanteenSelection(item.name)}
            >
                <Image source={item.image} style={styles.canteenImage} />
                <Text style={[styles.canteenText, selectedCanteen === item.name && styles.selectedCanteenText]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground
            source={require('@/assets/images/3dimg.jpg')} 
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Welcome, {user?.user.name}!</Text>
                    <Text style={styles.subText}>Select your canteen for the day:</Text>
                </View>

                <Animated.View style={[styles.canteenSelection, { opacity: fadeAnim }]}>
                    <FlatList
                        data={canteens}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCanteenItem}
                        numColumns={2}  
                        columnWrapperStyle={styles.columnWrapper} 
                    />
                </Animated.View>

                {selectedCanteen && (
                    <View style={styles.selectedCanteenContainer}>
                        <Text style={styles.selectedCanteenText}>You selected: {selectedCanteen}</Text>
                    </View>
                )}

                <Button title="Sign Out" onPress={signOut} color="#d9534f" />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        borderRadius: 15,
        padding: 20,
    },
    welcomeSection: {
        marginBottom: 50,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subText: {
        fontSize: 16,
        color: '#ddd',
    },
    canteenSelection: {
        marginBottom: 30,
        width: '100%',
    },
    columnWrapper: {
        justifyContent: 'space-between',  
    },
    canteenButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
        width: '45%',  
    },
    canteenImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 0,
    },
    canteenText: {
        color: 'white',
        fontSize: 14, 
        flexWrap: 'wrap',  
        textAlign: 'center',  
    },
    selectedCanteen: {
        backgroundColor: '#28a745',
    },
    selectedCanteenContainer: {
        marginBottom: 20,
    },
    selectedCanteenText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
    },
});


