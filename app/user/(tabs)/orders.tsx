import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserOrders } from '@/lib/services/realtime';
import { useAuth } from '@/lib/context/AuthContext';

const orders = () => {
    const [userOrders, setUserOrders] = useState(null);
    const { user } = useAuth();
    const userId = user!.uid; // Replace with the actual user ID

    useEffect(() => {
        const fetchOrders = async () => {
            const orders = await getUserOrders(userId);
            setUserOrders(orders);
        };
        fetchOrders();
    }, []);

    return (
        <SafeAreaView>
            <Text>Orders</Text>
            {userOrders ? (
                <FlatList
                    data={Object.entries(userOrders)}
                    keyExtractor={([key]) => key}
                    renderItem={({ item: [key, order] }) => (
                        <View>
                            <Text>Order ID: {key}</Text>
                            <Text>{JSON.stringify(order)}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>Loading...</Text>
            )}
        </SafeAreaView>
    );
};

export default orders;