import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToUserOrders } from '@/lib/services/realtime';
import { useAuth } from '@/lib/context/AuthContext';

const orders = () => {
    const [userOrders, setUserOrders] = useState(null);
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