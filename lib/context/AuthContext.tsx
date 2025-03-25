import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@react-native-google-signin/google-signin";
import { googleSignOut } from "../services/authService";
import { addMemberToFirestore } from "../services/firestoreService";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signIn: (role : "user" | "admin" | "canteen") => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((fbuser) => {
      setUser(fbuser);
    });
    return subscriber;
  }, []);

  const signIn = async (role : "user" | "admin" | "canteen" ) => {
    const user = await addMemberToFirestore(role);
    if(!user) {
      throw new Error('User not found');
    }
    setUser(user);
  };

  const signOut = async () => {
    await auth().signOut();
    await googleSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
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
