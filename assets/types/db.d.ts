import { CartItem } from "@/lib/context/CartContext";
import { Firestore } from "firebase/firestore";

type CanteenData = {
    id: string;
    image: string;
    name: string;
    location: string;
    timings: { close: string; open: string };
    menu: MenuItem[];
}

export interface MenuItem {
    item_id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description?: string;
    image?: string;
    category?: string;
    rating?: number;
    ratingCount?: number;
}

type OrderDetails = {
    userId: string;
    canteenId: string;
    canteenName: string;
    orderStatus: "pending" | "ready" | "cancelled" | "preparing" | "completed";
    cart: CartItem[];
    paymentMethod: string;
    scheduledTime: Date;
    paymentStatus: "pending" | "completed" | "failed";
};

type UserExpense = {
    canteenId: string;
    canteenName: string;
    amountSpent: number;
    orderId: string;
    date: Firestore.Timestamp;
}

type UserOrders = Record<string, OrderDetails>;