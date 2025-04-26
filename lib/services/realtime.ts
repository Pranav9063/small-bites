
import { OrderDetails, UserExpense, UserOrders } from "@/assets/types/db"
import { equalTo, onValue, orderByChild, query, ref, set, update, remove } from "@react-native-firebase/database"
import { database } from "@/lib/services/firebaseConfig";
import { addCompletedOrderToFirestore, addUserExpense, fetchCanteenByCanteenOwnerId } from "./firestoreService";

export async function placeNewOrder(orderId: string, OrderDetails: OrderDetails) {
    try {
        console.log("Placing order:", OrderDetails);
        const orderRef = ref(database, `orders/${orderId}`);
        await set(orderRef, OrderDetails);
        const userExpense: UserExpense = {
            canteenId: OrderDetails.canteenId,
            canteenName: OrderDetails.canteenName,
            amountSpent: OrderDetails.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            orderId: orderId,
            date: new Date()
        }
        await addUserExpense(OrderDetails.userId, userExpense);
        console.log("Order placed successfully:", orderId);
    } catch (error) {
        console.error("Error placing order:", error);
    }
}

export async function subscribeToUserOrders(userId: string, callback: (orders: UserOrders) => void) {
    try {
        const ordersRef = ref(database, `orders`);
        const userOrdersQuery = ordersRef.orderByChild('userId').equalTo(userId);
        const unsubscribe = onValue(userOrdersQuery, (snapshot) => {
            const data = snapshot.val() || {} as UserOrders;
            // console.log(data)
            // console.log(typeof (data))
            callback(data);
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching user orders:", error);
    }
}

export async function subscribeToCanteenOrders(userId: string, callback: (orders: any) => void) {
    try {
        const canteenId = await fetchCanteenByCanteenOwnerId(userId);
        if (!canteenId) {
            throw new Error("Canteen ID not found for user: " + userId);
        }

        const ordersQuery = query(
            ref(database, 'orders'),
            orderByChild('canteenId'),
            equalTo(canteenId.id)
        );

        const unsubscribe = onValue(ordersQuery, (snapshot) => {
            const data = snapshot.val() || {};
            callback(data);
        });

        // return unsubscribe function to allow manual cleanup
        return unsubscribe;
    } catch (error) {
        console.error("Error subscribing to canteen orders:", error);
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        const orderRef = ref(database, `orders/${orderId}`);
        await update(orderRef, { orderStatus: status });
        console.log("Order status updated successfully:", orderId);
    } catch (error) {
        console.error("Error updating order status:", error);
    }
}

export async function updateOrderStatusToCompleted(orderId: string, orderDeatils: OrderDetails) {
    try {
        const orderRef = ref(database, `orders/${orderId}`);
        await update(orderRef, { orderStatus: "completed" });
        console.log("Order status updated to completed successfully:", orderId);
        await addCompletedOrderToFirestore(orderId, { ...orderDeatils, orderStatus: "completed" });
        console.log("Order added to completed orders in Firestore:", orderId);
        await remove(orderRef);
    } catch (error) {
        console.error("Error updating order status to completed:", error);
    }
}