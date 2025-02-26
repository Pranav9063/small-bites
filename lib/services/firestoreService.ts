import { db } from "@/lib/services/firebaseConfig";
import { doc, setDoc, getDoc, addDoc, collection } from "@react-native-firebase/firestore";

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
  email: string;
  role: "user" | "admin" | "staff";
  createdAt: Date;
};

export const addUserToFirestore = async (user: NewUser) => {
  try {
    const userRef = doc(db, "Users", user.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists) {
      const newUser: FirestoreUser = {
        name: user.name,
        email: user.email,
        role: "user",
        createdAt: new Date(),
      };
      await setDoc(userRef, newUser);
      console.log("User added successfully!");
    } else {
      console.log("User already exists.");
    }
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

export const registerCanteen = async (canteenData: any) => {
  try {
    await addDoc(collection(db, "canteens"), canteenData);
    return { success: true };
  } catch (error) {
    console.error("Firestore Error:", error);
    return { success: false, error };
  }
};
