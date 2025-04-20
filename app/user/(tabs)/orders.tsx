import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToUserOrders, updateOrderStatusToCompleted } from '@/lib/services/realtime';
import { fetchCompletedOrders } from '@/lib/services/firestoreService';
import { useAuth } from '@/lib/context/AuthContext';
import { OrderDetails, UserOrders } from '@/assets/types/db';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const Orders = () => {
    const [userOrders, setUserOrders] = useState<UserOrders>();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('active'); // 'active' or 'past'
    const { user } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const theme = useTheme();
    const styles = createStyles(theme); // Assuming you have a theme object to pass
    const [pastOrders, setPastOrders] = useState<UserOrders>();
    const [isPastOrdersLoading, setIsPastOrdersLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        let unsubscribe: (() => void) | undefined;

        const loadOrders = async () => {
            setIsLoading(true);
            // Subscribe to active orders in real-time
            unsubscribe = await subscribeToUserOrders(user.uid, (fetchedOrders) => {
                setUserOrders(fetchedOrders);
                setIsLoading(false);
                // Fade in animation
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
            // Load past orders when needed
            if (selectedTab === 'past') {
                loadPastOrders();
            }
        };
        loadOrders();

        return () => {
            if (unsubscribe) unsubscribe(); // Cleanup on unmount
        };
    }, [user]);

    useEffect(() => {
        if (selectedTab === 'past' && user) {
            loadPastOrders();
        }
    }, [selectedTab, user]);

    const loadPastOrders = async () => {
        if (!user) return;

        try {
            setIsPastOrdersLoading(true);
            const completed = await fetchCompletedOrders(user.uid);
            setPastOrders(completed);
        } catch (error) {
            console.error("Error loading past orders:", error);
        } finally {
            setIsPastOrdersLoading(false);
        }
    };

    const getStatusStyle = (status: OrderDetails['orderStatus']): { badge: any; text: any; icon: "check-circle" | "hourglass-empty" | "local-dining" | "done-all" | "cancel" } => {
        switch (status) {
            case 'ready':
                return {
                    badge: styles.statusReady,
                    text: styles.statusReadyText,
                    icon: 'check-circle'
                };
            case 'pending':
                return {
                    badge: styles.statusPending,
                    text: styles.statusPendingText,
                    icon: 'hourglass-empty'
                };
            case 'preparing':
                return {
                    badge: styles.statusPreparing,
                    text: styles.statusPreparingText,
                    icon: 'local-dining'
                };
            case 'completed':
                return {
                    badge: styles.statusCompleted,
                    text: styles.statusCompletedText,
                    icon: 'done-all'
                };
            case 'cancelled':
                return {
                    badge: styles.statusCancelled,
                    text: styles.statusCancelledText,
                    icon: 'cancel'
                };
            default:
                return {
                    badge: styles.statusPending,
                    text: styles.statusPendingText,
                    icon: 'hourglass-empty'
                };
        }
    };

    const isActiveOrder = (status: OrderDetails['orderStatus']) => {
        return ['pending', 'preparing', 'ready'].includes(status);
    };

    const filteredOrders = selectedTab === 'active'
        ? (userOrders ? Object.entries(userOrders).filter(([_, order]) => isActiveOrder(order.orderStatus)) : [])
        : (pastOrders ? Object.entries(pastOrders) : []);

    const calculateTotal = (cart: any[]) => {
        return cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    };

    const calculateTotalItems = (cart: any[]) => {
        return cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCompletedOrder = async (key: string, order: OrderDetails) => {
        try {
            await updateOrderStatusToCompleted(key, order);
            setUserOrders((prevOrders) => {
                if (!prevOrders) return prevOrders;
                prevOrders[key] = order;
                prevOrders[key].orderStatus = 'completed';
                return prevOrders;
            });
        } catch (error) {

        }
    };

    const renderOrderItem = ({ item: [key, order] }: { item: [string, OrderDetails] }) => {
        const statusStyle = getStatusStyle(order.orderStatus);
        const totalPrice = calculateTotal(order.cart);
        const totalItems = calculateTotalItems(order.cart);

        return (
            <Animated.View style={[styles.orderCard, { opacity: fadeAnim }]}>
                <View style={styles.orderHeader}>
                    <View style={styles.orderIdContainer}>
                        <Text style={styles.orderIdLabel}>Order ID</Text>
                        <Text style={styles.orderIdText}>#{key.slice(-6).toUpperCase()}</Text>
                    </View>
                    <View style={[styles.statusBadge, statusStyle.badge]}>
                        <MaterialIcons name={statusStyle.icon} size={14} color={statusStyle.text.color} style={styles.statusIcon} />
                        <Text style={[styles.statusText, statusStyle.text]}>{order.orderStatus}</Text>
                    </View>
                </View>

                <View style={styles.orderInfo}>
                    <View style={styles.canteenContainer}>
                        <MaterialIcons name="restaurant" size={18} color="#555" style={styles.infoIcon} />
                        <Text style={styles.canteenName}>{order.canteenName}</Text>
                    </View>
                    <View>
                        <View style={styles.paymentContainer}>
                            <MaterialIcons name="payment" size={16} color="#555" style={styles.infoIcon} />
                            <Text style={styles.paymentMethod}>{order.paymentMethod || "Cash"}</Text>
                        </View>
                        {key && (
                            <View style={styles.timeContainer}>
                                <MaterialIcons name="access-time" size={16} color="#555" style={styles.infoIcon} />
                                <Text style={styles.timeText}>{formatDate(parseInt(key, 10))}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.itemsHeader}>Items</Text>
                {order.cart?.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                            <Text style={styles.itemName}>{item.name}</Text>
                        </View>
                        <Text style={styles.itemPrice}>Rs. {(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.orderSummary}>
                    <Text style={styles.totalItemsText}>{totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
                    <Text style={styles.totalPriceText}>Total: Rs. {totalPrice.toFixed(2)}</Text>
                </View>

                {isActiveOrder(order.orderStatus) && (
                    <TouchableOpacity
                        style={[
                            styles.trackButton,
                            order.orderStatus !== 'ready' && { backgroundColor: theme.colors.inversePrimary }
                        ]}
                        disabled={order.orderStatus !== 'ready'}
                        onPress={() => { handleCompletedOrder(key, order) }}
                    >
                        <Text style={styles.trackButtonText}>Mark as Recieved</Text>
                        <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name={selectedTab === 'active' ? 'pending-actions' : 'history'} size={70} color="#ccc" />
            <Text style={styles.emptyText}>
                No {selectedTab === 'active' ? 'active' : 'past'} orders found
            </Text>
            {selectedTab === 'active' && (
                <TouchableOpacity style={styles.browseButton} onPress={() => { router.push('/user/(tabs)') }}>
                    <Text style={styles.browseButtonText}>Browse Canteens</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Orders</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'active' && styles.activeTab]}
                    onPress={() => setSelectedTab('active')}
                >
                    <Text style={[styles.tabText, selectedTab === 'active' && styles.activeTabText]}>
                        Active Orders
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'past' && styles.activeTab]}
                    onPress={() => setSelectedTab('past')}
                >
                    <Text style={[styles.tabText, selectedTab === 'past' && styles.activeTabText]}>
                        Order History
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading && selectedTab === 'active' || (isPastOrdersLoading && selectedTab === 'past') ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>
                        Loading your {selectedTab === 'active' ? 'active' : 'past'} orders...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={([key]) => key}
                    renderItem={renderOrderItem}
                    contentContainerStyle={[
                        styles.listContainer,
                        filteredOrders.length === 0 && styles.emptyListContainer
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyList}
                />
            )}
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#777',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    listContainer: {
        padding: 12,
        paddingBottom: 24,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderIdContainer: {
        flexDirection: 'column',
    },
    orderIdLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 2,
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusIcon: {
        marginRight: 4,
    },
    // Status styles
    statusReady: {
        backgroundColor: '#E7F7ED',
    },
    statusReadyText: {
        color: '#0A8043',
    },
    statusPending: {
        backgroundColor: '#F0F0F0',
    },
    statusPendingText: {
        color: '#737373',
    },
    statusPreparing: {
        backgroundColor: '#E6F2FF',
    },
    statusPreparingText: {
        color: '#0066CC',
    },
    statusCompleted: {
        backgroundColor: '#E0F2F1',
    },
    statusCompletedText: {
        color: '#00796B',
    },
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    canteenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    paymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: 6,
    },
    canteenName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    paymentMethod: {
        fontSize: 14,
        color: '#555',
        textTransform: 'capitalize',
    },
    timeText: {
        fontSize: 14,
        color: '#555',
    },
    divider: {
        height: 1,
        backgroundColor: '#e8e8e8',
        marginVertical: 12,
    },
    itemsHeader: {
        fontSize: 15,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10,
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
        flex: 1,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
        marginRight: 8,
        minWidth: 24,
    },
    itemName: {
        fontSize: 15,
        color: '#333',
        flex: 1,
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
        marginBottom: 10,
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
    trackButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    trackButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        marginRight: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#777',
        marginTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    browseButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default Orders;