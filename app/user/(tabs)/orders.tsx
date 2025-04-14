import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToUserOrders } from '@/lib/services/realtime';
import { useAuth } from '@/lib/context/AuthContext';
import { StyleSheet } from 'react-native';
import { OrderDetails, UserOrders } from '@/assets/types/db';

const orders = () => {
    const [userOrders, setUserOrders] = useState<UserOrders>();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        let unsubscribe: (() => void) | undefined;

        const listenToOrders = async () => {
            unsubscribe = await subscribeToUserOrders(user.uid, (fetchedOrders) => {
                setUserOrders(fetchedOrders);
            });
        };

        listenToOrders();

        return () => {
            if (unsubscribe) unsubscribe(); // Cleanup on unmount
        };
    }, []);

    
    const getStatusStyle = (status) => {
        switch (status) {
            case 'ready':
                return {
                    badge: styles.statusReady,
                    text: styles.statusReadyText
                };
            case 'pending':
                return {
                    badge: styles.statusPending,
                    text: styles.statusPendingText
                };
            case 'preparing':
                return {
                    badge: styles.statusPreparing,
                    text: styles.statusPreparingText
                };
            case 'completed':
                return {
                    badge: styles.statusCompleted,
                    text: styles.statusCompletedText
                };
            case 'cancelled':
                return {
                    badge: styles.statusCancelled,
                    text: styles.statusCancelledText
                };
            default:
                return {
                    badge: styles.statusPending,
                    text: styles.statusPendingText
                };
        }
    };

    const renderOrderItem = ({ item: [key, order] }: { item: [string, OrderDetails] }) => {        // // Calculate total items and price
        // const totalItems = order.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        // const totalPrice = order.cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
        const statusStyle = getStatusStyle(order.orderStatus);
        return (
            <TouchableOpacity style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderIdText}>Order #{key}</Text>
                    <View style={[styles.statusBadge, statusStyle.badge]}>
                        <Text style={[styles.statusText, statusStyle.text]}>{order.orderStatus}</Text>
                    </View>
                </View>
                
                <View style={styles.orderInfo}>
                    <Text style={styles.canteenName}>{order.canteenName}</Text>
                    <Text style={styles.paymentMethod}>Payment: {order.paymentMethod || "cash"}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.itemsHeader}>Items:</Text>
                {order.cart?.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                        </View>
                        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
                
                <View style={styles.divider} />
                
                {/* <View style={styles.orderSummary}>
                    <Text style={styles.totalItemsText}>{totalItems} items</Text>
                    <Text style={styles.totalPriceText}>Total: ${totalPrice.toFixed(2)}</Text>
                </View> */}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>My Orders</Text>
            
            {userOrders ? (
                <FlatList
                    data={Object.entries(userOrders)}
                    keyExtractor={([key]) => key}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading orders...</Text>
                </View>
            )}
            
            {userOrders && Object.keys(userOrders).length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No orders found</Text>
                </View>
            )}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
        color: '#333',
    },
    listContainer: {
        padding: 12,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
   
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    // Status: Ready
    statusReady: {
        backgroundColor: '#E7F7ED',
    },
    statusReadyText: {
        color: '#0A8043',
    },
    // Status: Pending
    statusPending: {
        backgroundColor: '#F0F0F0',
    },
    statusPendingText: {
        color: '#737373',
    },
    // Status: Preparing
    statusPreparing: {
        backgroundColor: '#E6F2FF',
    },
    statusPreparingText: {
        color: '#0066CC',
    },
    // Status: Completed
    statusCompleted: {
        backgroundColor: '#E0F2F1',
    },
    statusCompletedText: {
        color: '#00796B',
    },
    // Status: Cancelled
    statusCancelled: {
        backgroundColor: '#FFEBEE',
    },
    statusCancelledText: {
        color: '#D32F2F',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    orderInfo: {
        marginBottom: 10,
    },
    canteenName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
    },
    paymentMethod: {
        fontSize: 14,
        color: '#777',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    itemsHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 15,
        color: '#333',
        marginRight: 8,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#777',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    totalItemsText: {
        fontSize: 14,
        color: '#777',
    },
    totalPriceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#777',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
    },
});

export default orders;





/*import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToUserOrders } from '@/lib/services/realtime';
import { useAuth } from '@/lib/context/AuthContext';

const orders = () => {
    const [userOrders, setUserOrders] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        let unsubscribe;

        const listenToOrders = async () => {
            unsubscribe = await subscribeToUserOrders(user.uid, (fetchedOrders) => {
                setUserOrders(fetchedOrders);
            });
        };

        listenToOrders();

        return () => {
            if (unsubscribe) unsubscribe(); // Cleanup on unmount
        };
    }, [user]);

    const renderOrderItem = ({ item: [orderId, order] }) => {
        // Calculate total items and price
        const totalItems = order.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const totalPrice = order.cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

        return (
            <TouchableOpacity style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderIdText}>Order #{orderId}</Text>
                    <View style={[
                        styles.statusBadge, 
                        order.orderStatus === 'ready' ? styles.statusReady : 
                        order.orderStatus === 'processing' ? styles.statusProcessing : 
                        styles.statusPending
                    ]}>
                        <Text style={styles.statusText}>{order.orderStatus}</Text>
                    </View>
                </View>
                
                <View style={styles.orderInfo}>
                    <Text style={styles.canteenName}>{order.canteenName}</Text>
                    <Text style={styles.paymentMethod}>Payment: {order.paymentMethod || "cash"}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.itemsHeader}>Items:</Text>
                {order.cart?.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                        </View>
                        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
                
                <View style={styles.divider} />
                
                <View style={styles.orderSummary}>
                    <Text style={styles.totalItemsText}>{totalItems} items</Text>
                    <Text style={styles.totalPriceText}>Total: ${totalPrice.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>My Orders</Text>
            
            {userOrders ? (
                <FlatList
                    data={Object.entries(userOrders)}
                    keyExtractor={([key]) => key}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading orders...</Text>
                </View>
            )}
            
            {userOrders && Object.keys(userOrders).length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No orders found</Text>
                </View>
            )}
        </SafeAreaView>
    );
};


export default orders; */