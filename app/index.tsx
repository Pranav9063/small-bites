import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { fetchRole } from "@/lib/services/firestoreService";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

const HomePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"user" | "canteen" | "admin">();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const getUserRole = async () => {
      try {
        const userRole = await fetchRole(user.uid);
        setRole(userRole);
        console.log(userRole);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, [user]);

  // Redirect only after role is fetched and component has rendered
  useEffect(() => {
    if (role === "user") {
      router.replace("/user/(tabs)");
    }
    if (role === "canteen") {
      router.replace("/canteen/(tabs)/orders");
    }
  }, [role, router]);

  if (!user || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // Ensure component returns something
};

export default HomePage;
