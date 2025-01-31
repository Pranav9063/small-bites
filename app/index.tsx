import { Pressable, Text, View, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { GoogleSignin, NativeModuleError, statusCodes, User } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { setDoc, getFirestore, doc, getDoc, } from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const db = getFirestore();

  type NewUser = {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    familyName: string | null;
    givenName: string | null;
  }

  type FirestoreUser = {
    name: string | null;
    email: string;
    role: "user" | "admin" | "staff";
    createdAt: Date;
  }

  const addUserToFirestore = async (user: NewUser) => {
    try {
      const userRef = doc(db, "Users", user.id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists) {
        const newUser : FirestoreUser = {
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

  const googleSignIn = async () => {
    try {
      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In failed');
      }

      if(!userInfo.data?.user) {
        throw new Error('Google Sign-In failed : User data not found');
      }

       // Authenticate with Firebase
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      // Update user state
      setUser(userInfo.data);
      await addUserToFirestore(userInfo.data.user);
      setError('');
      alert('Google Sign-In successful and linked to Firebase!');
    } catch (err) {
      const error = err as NativeModuleError;
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setError('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Play services not available or outdated');
      } else {
        setError(error.message);
      }
    }
  };

  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentUser = async () => {
    const currentUser = GoogleSignin.getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={googleSignIn}>
        <Ionicons name="logo-google" color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>  Google Sign In</Text>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Sign out" onPress={googleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#4285F4",
    borderRadius: 5,
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    marginRight: 10,
  },
  buttonIcon: {
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
