import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/AuthContext';
import { OrderDetails, UserOrders } from '@/assets/types/db';
import { subscribeToCanteenOrders } from '@/lib/services/realtime';
import { useTheme } from 'react-native-paper';
import { Theme } from '@/constants/Theme';
import { fetchCompletedOrdersByCanteenId } from '@/lib/services/firestoreService';

const OrdersScreen = () => {
    const [canteenOrders, setCanteenOrders] = useState<UserOrders>();
    const [isLoading, setIsLoading] = useState(true);
    const [pastOrders, setPastOrders] = useState<UserOrders | null>();
    const [isPastOrdersLoading, setIsPastOrdersLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('active');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { user } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        if (!user) return;

        let unsubscribe: (() => void) | undefined;

        const listenToOrders = async () => {
            setIsLoading(true);
            unsubscribe = await subscribeToCanteenOrders(user.uid, (fetchedOrders) => {
                setCanteenOrders(fetchedOrders);
                setIsLoading(false);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });

            if (selectedTab === 'past') {
                loadPastOrders();
            }
        };

        listenToOrders();

        return () => {
            if (unsubscribe) unsubscribe();
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
            const completed = await fetchCompletedOrdersByCanteenId(user.uid);
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
        ? (canteenOrders ? Object.entries(canteenOrders).filter(([_, order]) => isActiveOrder(order.orderStatus)) : [])
        : (pastOrders ? Object.entries(pastOrders) : []);

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

    const renderOrderCard = ({ item }: { item: [string, OrderDetails] }) => {
        const [orderId, order] = item;
        const statusStyle = getStatusStyle(order.orderStatus);
        return (
            <TouchableOpacity
                style={styles.orderCard}
                onPress={() => router.push(`/canteen/orders/${orderId}`)}
            >
                <View style={styles.orderHeader}>
                    <View style={styles.orderIdContainer}>
                        <Text style={styles.orderIdLabel}>Order ID</Text>
                        <Text style={styles.orderIdText}>#{orderId.slice(-6).toUpperCase()}</Text>
                    </View>
                    <View style={[styles.statusBadge, statusStyle.badge]}>
                        <MaterialIcons name={statusStyle.icon} size={14} color={statusStyle.text.color} style={styles.statusIcon} />
                        <Text style={[styles.statusText, statusStyle.text]}>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</Text>
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
                        {orderId && (
                            <View style={styles.timeContainer}>
                                <MaterialIcons name="access-time" size={16} color="#555" style={styles.infoIcon} />
                                <Text style={styles.timeText}>{formatDate(parseInt(orderId, 10))}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Show delivery location if present */}
                {order.delivery && (
                    <View style={styles.deliveryInfoContainer}>
                        <Text style={styles.deliveryInfoHeader}>Delivery Location</Text>
                        <Text style={styles.deliveryInfoLabel}>
                            Name: <Text style={styles.deliveryInfoValue}>{order.delivery.name}</Text>
                        </Text>
                        <Text style={styles.deliveryInfoLabel}>
                            Phone: <Text style={styles.deliveryInfoValue}>{order.delivery.phone}</Text>
                        </Text>
                        <Text style={styles.deliveryInfoLabel}>
                            Address: <Text style={styles.deliveryInfoValue}>{order.delivery.address}</Text>
                        </Text>
                        {order.delivery.landmark ? (
                            <Text style={styles.deliveryInfoLabel}>
                                Landmark: <Text style={styles.deliveryInfoValue}>{order.delivery.landmark}</Text>
                            </Text>
                        ) : null}
                    </View>
                )}

                <View style={styles.divider} />

                <View style={styles.itemsContainer}>
                    {order.cart.map((orderItem, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Ionicons name="restaurant-outline" size={16} color="#666" />
                            <Text style={styles.orderItemText}>
                                {orderItem.name} × {orderItem.quantity}
                            </Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
        )
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name={selectedTab === 'active' ? 'pending-actions' : 'history'} size={70} color="#ccc" />
            <Text style={styles.emptyText}>
                No {selectedTab === 'active' ? 'active' : 'past'} orders found
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
                    renderItem={renderOrderCard}
                    contentContainerStyle={[
                        styles.listContainer,
                        filteredOrders.length === 0 && styles.emptyListContainer
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyList}
                />
            )}
        </View>
    );
};

// **💡 Styles for Orders Screen**
const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    }, tabContainer: {
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
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    }, orderInfo: {
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
        backgroundColor: '#eee',
        marginVertical: 12,
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
    itemsContainer: {
        gap: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    orderItemText: {
        fontSize: 15,
        color: '#666',
        flex: 1,
    },
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
    }, loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#777',
        marginTop: 12,
    },
    deliveryInfoContainer: {
        backgroundColor: "#F7F9FC",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    deliveryInfoHeader: {
        fontWeight: "700",
        fontSize: 15,
        marginBottom: 4,
        color: "#00796B",
    },
    deliveryInfoLabel: {
        fontSize: 13,
        color: "#333",
        marginBottom: 2,
    },
    deliveryInfoValue: {
        fontWeight: "600",
        color: "#444",
    },
});

export default OrdersScreen;