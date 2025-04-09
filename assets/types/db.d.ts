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
    canteenId: string;
    canteenName: string;
    cart: CartItem[];
    paymentMethod: string;
    collectionTiming: string;
    scheduledTime: Date;
};