import { db } from "@/lib/services/firebaseConfig";
import { doc, setDoc, getDoc, addDoc, collection } from "@react-native-firebase/firestore";
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
  email: string;
  role: "user" | "admin" | "canteen";
  createdAt: Date;
};

export const addMemberToFirestore = async (role : "user" | "admin" | "canteen") => {
  try {
    const userInfo = await googleSignIn();
    // console.log(userInfo)
    if(!userInfo.data?.user) {
      throw new Error('Google Sign-In failed : User data not found');
    }
    const user = userInfo.data.user
    const userRef = doc(db, "Users", user.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists) {
      const newUser: FirestoreUser = {
        name: user.name,
        email: user.email,
        role: role,
        createdAt: new Date(),
      };
      await setDoc(userRef, newUser);
      console.log("User added successfully!");
      return user;
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

export const fetchRole = async (userId : string) => {
  try {
    const userRef = doc(db, "Users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists) {
      return userSnap.data()!.role;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
}
