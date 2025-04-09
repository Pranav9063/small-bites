
import { OrderDetails } from "@/assets/types/db"
import { ref, set } from "@react-native-firebase/database"
import { database } from "@/lib/services/firebaseConfig";

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