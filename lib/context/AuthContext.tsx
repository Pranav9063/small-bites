import { createContext, useContext, useState, useEffect } from "react";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { googleSignIn, googleSignOut } from "../services/authService";

type AuthContextType = {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const signIn = async () => {
    const userInfo = await googleSignIn();
    setUser(userInfo.data);
  };

  const signOut = async () => {
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
