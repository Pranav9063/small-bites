
import { OrderDetails, UserExpense } from "@/assets/types/db"
import { equalTo, onValue, orderByChild, query, ref, set, update } from "@react-native-firebase/database"
import { database } from "@/lib/services/firebaseConfig";
import { addNewOrderToFirestore, addUserExpense, fetchCanteenByCanteenOwnerId } from "./firestoreService";

export async function placeNewOrder(OrderDetails: OrderDetails) {
    try {
        console.log("Placing order:", OrderDetails);
        const orderId = new Date().getTime().toString();
        const orderRef = ref(database, `orders/${orderId}`);
        await set(orderRef, OrderDetails);
        const userExpense: UserExpense = {
            canteenId: OrderDetails.canteenId,
            canteenName: OrderDetails.canteenName,
            amountSpent: OrderDetails.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            orderId: orderId,
            date: new Date()
        }
        await addNewOrderToFirestore(orderId, OrderDetails);
        await addUserExpense(OrderDetails.userId, userExpense);
        console.log("Order placed successfully:", orderId);
    } catch (error) {
        console.error("Error placing order:", error);
    }
}

export async function subscribeToUserOrders(userId: string, callback: (orders: any) => void) {
    try {
        const ordersRef = ref(database, `orders`);
        const userOrdersQuery = ordersRef.orderByChild('userId').equalTo(userId);
        const unsubscribe = onValue(userOrdersQuery, (snapshot) => {
            const data = snapshot.val() || {};
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