import React, { useEffect, useState } from "react";
import UserHomeScreen from "@/components/screens/UserHomeScreen";
import { useAuth } from "@/lib/context/AuthContext";
import { fetchRole } from "@/lib/services/firestoreService";
import { ActivityIndicator, View } from "react-native";
import CanteenHomeScreen from "@/components/screens/CanteenHomeScreen";
import Dashboard from "./canteen";

const HomePage = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<"user" | "canteen" | "admin">();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const getUserRole = async () => {
      try {
        const userRole = await fetchRole(user.uid);
        setRole(userRole);
        console.log(userRole)
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, [user]);

  if (!user || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (role === "canteen") {
    return <Dashboard />;
  }

  return <UserHomeScreen />;
};

export default HomePage;
