import { db } from "@/lib/services/firebaseConfig";
import { doc, setDoc, getDoc, addDoc, collection, getDocs } from "@react-native-firebase/firestore";
import { googleSignIn } from "./authService";

export type NewUser = {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
};

export type FirestoreUser = {
  name: string | null;
  email: string | null;
  role: "user" | "admin" | "canteen";
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
    return { success: true , id : res.id};
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
    return {success: true , user};
  } catch (error) {
    console.error("Error adding user:", error);
    return {success: false, error};
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
      console.log(canteensData);
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
      console.log(canteenData);
      return canteenData;
    } else {
      throw new Error("Canteen not found");
    }
  } catch (error) {
    console.error("Error fetching canteen:", error);
    return null;
  }
}

export const fetchCanteenByCanteenOwnerId = async (userId: string) => {
  try {
    const userRef = doc(db,"users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists) {
      const userData = userSnap.data() as FirestoreCanteenOwner;
      const canteenId = userData.canteenId;
      if (canteenId) {
        const canteenRef = doc(db, "canteens", canteenId);
        const canteenSnap = await getDoc(canteenRef);
        if (canteenSnap.exists) {
          const canteenData = { id: canteenSnap.id, ...canteenSnap.data() };
          console.log(canteenData);
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
