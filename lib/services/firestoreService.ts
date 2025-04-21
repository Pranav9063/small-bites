import { db, storage } from "@/lib/services/firebaseConfig";
import { doc, setDoc, getDoc, addDoc, collection, getDocs, where, query } from "@react-native-firebase/firestore";
import { googleSignIn } from "./authService";
import { deleteObject, getMetadata, ref } from "@react-native-firebase/storage";
import { CanteenData, MenuItem, OrderDetails, UserExpense, UserOrders } from "@/assets/types/db";
import { CartItem } from "../context/CartContext";

export type NewUser = {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
};

export interface SavedOrder {
  orderId: string;
  canteenId: string;
  canteenName: string;
  cart: CartItem[];
}

export type FirestoreUser = {
  name: string | null;
  email: string | null;
  role: "user" | "admin" | "canteen";
  expenses: UserExpense[];
  savedOrders: SavedOrder[];
  createdAt: Date;
};

export type FirestoreCanteen = {
  name: string;
  location: string;
  menu: any[]; // Adjust this type based on your menu structure
  createdAt: Date;
};

export type FirestoreCanteenOwner = {
  name: string | null;
  email: string | null;
  role: "canteen";
  canteenId: string;
  createdAt: Date;
};

export const addMemberToFirestore = async (role: "user" | "admin" | "canteen") => {
  try {
    const userInfo = await googleSignIn();
    // console.log(userInfo)
    if (!userInfo.user) {
      throw new Error('Google Sign-In failed : User data not found');
    }
    const user = userInfo.user
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists) {
      const newUser: FirestoreUser = {
        name: user.displayName,
        email: user.email,
        role: role,
        expenses: [],
        savedOrders: [],
        createdAt: new Date(),
      };
      await setDoc(userRef, newUser);
      console.log("User added successfully!");
    } else {
      console.log("User already exists.");
    }
    return user;
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

export const registerCanteen = async (canteenData: any) => {
  try {
    const res = await addDoc(collection(db, "canteens"), canteenData);
    console.log("Canteen registered with ID:", res.id);
    return { success: true, id: res.id };
  } catch (error) {
    console.error("Firestore Error:", error);
    return { success: false, error };
  }
};

export const fetchRole = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreUser;
      return userData.role;
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.log("Error fetching role:", error);
  }
}

export const addCanteenOwnerToFirestore = async (canteenId: string) => {
  try {
    const userInfo = await googleSignIn();
    // console.log(userInfo)
    if (!userInfo.user) {
      throw new Error('Google Sign-In failed : User data not found');
    }
    const user = userInfo.user
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists) {
      const newUser = {
        name: user.displayName,
        email: user.email,
        role: "canteen",
        canteenId: canteenId,
        createdAt: new Date(),
      };
      await setDoc(userRef, newUser);
      console.log("User added successfully!");
    } else {
      console.log("User already exists.");
    }
    return { success: true, user };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, error };
  }
}

export const addSampleMenusToCanteen = async (canteenId: string, menu: any[]) => {
  try {
    const canteenRef = doc(db, "canteens", canteenId);
    const canteenSnap = await getDoc(canteenRef);

    if (canteenSnap.exists) {
      await setDoc(canteenRef, { menu }, { merge: true });
      console.log("Sample menus added successfully!");
      return { success: true };
    } else {
      console.log("Canteen not found.");
      return { success: false, error: "Canteen not found" };
    }
  } catch (error) {
    console.error("Error adding sample menus:", error);
    return { success: false, error };
  }
};

export const fetchAllCanteens = async () => {
  try {
    const canteensRef = collection(db, "canteens"); // ✅ Corrected: Use collection
    const canteensSnap = await getDocs(canteensRef);

    if (!canteensSnap.empty) {
      const canteensData = canteensSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // console.log(canteensData);
      return canteensData;
    } else {
      throw new Error("No canteens found");
    }
  } catch (error) {
    console.error("Error fetching canteens:", error);
    return [];
  }
};

export const fetchCanteenById = async (canteenId: string) => {
  try {
    const canteenRef = doc(db, "canteens", canteenId);
    const canteenSnap = await getDoc(canteenRef);

    if (canteenSnap.exists) {
      const canteenData = { id: canteenSnap.id, ...canteenSnap.data() };
      // console.log(canteenData);
      return canteenData;
    } else {
      throw new Error("Canteen not found");
    }
  } catch (error) {
    console.error("Error fetching canteen:", error);
    return null;
  }
}

export function convertFirestoreTimestampToDate(timestamp: { seconds: number; nanoseconds: number }): string {
  const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
  const day = date.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}


export const fetchCanteenByCanteenOwnerId = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreCanteenOwner;
      const canteenId = userData.canteenId;
      if (canteenId) {
        const canteenRef = doc(db, "canteens", canteenId);
        const canteenSnap = await getDoc(canteenRef);
        if (canteenSnap.exists) {
          const canteenData = { id: canteenSnap.id, ...canteenSnap.data() };
          // console.log(canteenData);
          return canteenData;
        } else {
          throw new Error("Canteen not found");
        }
      } else {
        throw new Error("User does not have a canteen ID");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching canteen:", error);
    return null;
  }
}

const getCanteenIdFromUserId = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreCanteenOwner;
      return userData.canteenId;
    } else {
      console.log("User not found.");
      return null;
    }
  }
  catch (error) {
    console.error("Error fetching canteen ID:", error);
    return null;
  }
}

export const addMenuItemToCanteen = async (userId: string, menuItem: any) => {
  try {
    const canteenId = await getCanteenIdFromUserId(userId);
    if (!canteenId) {
      throw new Error("Canteen ID not found for user.");
    }
    const canteenRef = doc(db, "canteens", canteenId);
    const canteenSnap = await getDoc(canteenRef);

    if (canteenSnap.exists) {
      const canteenData = canteenSnap.data();
      const menu = canteenData ? canteenData.menu || [] : [];
      menu.push(menuItem);
      await setDoc(canteenRef, { menu }, { merge: true });
      console.log("Menu item added successfully!");
      return { success: true };
    } else {
      throw new Error("Canteen not found.");
    }
  } catch (error) {
    console.error("Error adding menu item:", error);
    return { success: false, error };
  }
}

export const deleteMenuItemFromCanteen = async (userId: string, itemId: string) => {
  try {
    const canteenId = await getCanteenIdFromUserId(userId);
    if (!canteenId) {
      throw new Error("Canteen ID not found for user.");
    }
    console.log(canteenId)
    const canteenRef = doc(db, "canteens", canteenId);
    const canteenSnap = await getDoc(canteenRef);

    if (canteenSnap.exists) {
      const canteenData = canteenSnap.data() as CanteenData;
      const menu = canteenData ? canteenData.menu || [] : [] as MenuItem[];
      const imageURL = menu.find((item) => item.item_id === itemId)?.image;
      const updatedMenu = menu.filter((item) => item.item_id !== itemId);
      await setDoc(canteenRef, { menu: updatedMenu }, { merge: true });
      // Delete image from storage if necessary
      if (imageURL) {
        const imagePath = imageURL.replace(/.*\/o\/(.+)\?.*/, "$1").replace("%2F", "/");
        const storageRef = ref(storage, decodeURIComponent(imagePath));
        try {
          await getMetadata(storageRef); // Check if the file exists
          await deleteObject(storageRef);
        } catch (error: any) {
          if (error.code === "storage/object-not-found") {
            console.warn("Image not found, skipping deletion");
          } else {
            console.error("Error deleting image:", error);
          }
        }
      }
      console.log("Menu item deleted successfully!");
      return { success: true };
    } else {
      throw new Error("Canteen not found.");
    }
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error };
  }
}

export const addUserExpense = async (userId: string, expense: UserExpense) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreUser;
      const temp = userData.expenses || [];
      const expenses = [expense, ...temp];
      await setDoc(userRef, { expenses }, { merge: true });
      console.log("Expense added successfully!");
      return { success: true };
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, error };
  }
}

export const fetchUserExpenses = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreUser;
      return userData.expenses || [];
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return null;
  }
}

// export const addNewOrderToFirestore = async (orderId: string, orderDetails: OrderDetails) => {
//   try {
//     const orderRef = doc(db, "orders", orderId);
//     await setDoc(orderRef, orderDetails);
//     console.log("Order added successfully!");
//     return { success: true };
//   } catch (error) {
//     console.error("Error adding order:", error);
//     return { success: false, error };
//   }
// }

export const addNewSavedOrderToFirestore = async (userId: string, orderDetails: SavedOrder) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreUser;
      const savedOrders = userData.savedOrders || [];
      savedOrders.push({ ...orderDetails });
      await setDoc(userRef, { savedOrders }, { merge: true });
      console.log("Saved order added successfully!");
      return { success: true };
    }
  } catch (error) {
    console.error("Error adding saved order:", error);
    return { success: false, error };
  }
}

export const fetchSavedOrdersByUserId = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreUser;
      return userData.savedOrders || [];
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error fetching saved orders:", error);
    return null;
  }
}
export const deleteSavedOrder = async (userId: string, orderId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreUser;
      const savedOrders = userData.savedOrders || [];
      const updatedSavedOrders = savedOrders.filter((order) => order.orderId !== orderId);
      await setDoc(userRef, { savedOrders: updatedSavedOrders }, { merge: true });
      console.log("Saved order deleted successfully!");
      return { success: true };
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error deleting saved order:", error);
    return { success: false, error };
  }
}

export const addCompletedOrderToFirestore = async (orderId: string, orderDetails: OrderDetails) => {
  try {
    const orderRef = doc(db, "completed-orders", orderId);
    await setDoc(orderRef, orderDetails);
    console.log("Completed order added successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error adding completed order:", error);
    return { success: false, error };
  }
}

export const fetchCompletedOrders = async (userId: string) => {
  try {
    const completedOrdersRef = collection(db, "completed-orders");
    const q = query(completedOrdersRef, where("userId", "==", userId));
    const completedOrdersSnap = await getDocs(q);

    if (!completedOrdersSnap.empty) {
      const data = completedOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as [];
      // convert to UserOrders type
      const userOrders: UserOrders = data.reduce((acc, order: { id: string } & OrderDetails) => {
        const temp = {
          userId: order.userId,
          canteenId: order.canteenId,
          canteenName: order.canteenName,
          cart: order.cart,
          paymentMethod: order.paymentMethod,
          scheduledTime: order.scheduledTime,
          orderStatus: order.orderStatus,
        }
        acc[order.id] = temp;
        return acc;
      }, {} as UserOrders);
      console.log(userOrders)
      return userOrders;
    }
  } catch (error) {
    console.error("Error fetching completed orders:", error);
  }
};

export const fetchCompletedOrdersByCanteenId = async (userId: string) => {
  try {
    const canteenId = await getCanteenIdFromUserId(userId);
    const ordersRef = collection(db, "completedOrders");
    const q = query(ordersRef, where("canteenId", "==", canteenId));
    const ordersSnap = await getDocs(q);

    if (!ordersSnap.empty) {
      const data = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as [];
      // convert to UserOrders type
      const canteenOrders: UserOrders = data.reduce((acc, order: { id: string } & OrderDetails) => {
        const temp = {
          userId: order.userId,
          canteenId: order.canteenId,
          canteenName: order.canteenName,
          cart: order.cart,
          paymentMethod: order.paymentMethod,
          scheduledTime: order.scheduledTime,
          orderStatus: order.orderStatus,
        }
        acc[order.id] = temp;
        return acc;
      }, {} as UserOrders);
      return canteenOrders
    } else {
      console.log("No orders found for this canteen.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};