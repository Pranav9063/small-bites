import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@react-native-google-signin/google-signin";
import { googleSignOut } from "../services/authService";
import { addMemberToFirestore } from "../services/firestoreService";
import { FirebaseAuthTypes, onAuthStateChanged, signOut } from "@react-native-firebase/auth";
import { auth } from "../services/firebaseConfig";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signIn: (role: "user" | "admin" | "canteen") => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (fbuser: FirebaseAuthTypes.User) => {
      setUser(fbuser);
    });
    return subscriber;
  }, []);

  const signIn = async (role: "user" | "admin" | "canteen") => {
    const user = await addMemberToFirestore(role);
    if (!user) {
      throw new Error('User not found');
    }
    setUser(user);
  };

  const signOutUser = async () => {
    await signOut(auth);
    await googleSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
