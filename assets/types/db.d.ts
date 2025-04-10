import { CartItem } from "@/lib/context/CartContext";

type CanteenData = {
    id: string;
    image: string;
    name: string;
    location: string;
    timings: { close: string; open: string };
    menu: MenuItem[];
}

type MenuItem = {
    item_id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    calories?: number;
    image?: string;
    availability: boolean;
}

type OrderDetails = {
    orderId: string;
    userId: string;
    canteenId: string;
    canteenName: string;
    orderStatus: "pending" | "ready" | "cancelled" | "preparing" | "completed";
    cart: CartItem[];
    paymentMethod: string;
    scheduledTime: Date;
};