
import { OrderDetails } from "@/assets/types/db"
import { ref, set } from "@react-native-firebase/database"
import { database } from "@/lib/services/firebaseConfig";
import { fetchCanteenByCanteenOwnerId } from "./firestoreService";

export async function placeNewOrder(OrderDetails: OrderDetails) {
    try {
        console.log("Placing order:", OrderDetails);
        const orderId = new Date().getTime().toString();
        const orderRef = ref(database, `orders/${orderId}`);
        await set(orderRef, OrderDetails);
        console.log("Order placed successfully:", orderId);
    } catch (error) {
        console.error("Error placing order:", error);
    }
}

export async function getUserOrders(userId: string) {
    try {
        const ordersRef = ref(database, `orders`);
        const userOrdersQuery = ordersRef.orderByChild('userId').equalTo(userId);
        const userOrders = await userOrdersQuery.once('value').then(snapshot => {
            const userOrders = snapshot.val();
            return userOrders;
        });
        return userOrders;
    } catch (error) {
        console.error("Error fetching user orders:", error);
    }
}

export async function getCanteenOrders(userId: string) {
    try {
        const canteenId = await fetchCanteenByCanteenOwnerId(userId);
        if (!canteenId) {
            throw new Error("Canteen ID not found for user: " + userId);
        }
        const ordersRef = ref(database, `orders`);
        const canteenOrdersQuery = ordersRef.orderByChild('canteenId').equalTo(canteenId.id);
        const canteenOrders = await canteenOrdersQuery.once('value').then(snapshot => {
            const canteenOrders = snapshot.val();
            return canteenOrders;
        });
        return canteenOrders;
    } catch (error) {
        console.error("Error fetching canteen orders:", error);
    }
}