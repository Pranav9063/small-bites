import React, { useState } from "react";
import { Text, Alert, TouchableOpacity, Image, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, TextInput, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { addMemberToFirestore, registerCanteen } from "@/lib/services/firestoreService";
import { Link } from "expo-router";

const CanteenSignUpScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // 📌 Single state object for all form fields
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    timings: { open: "", close: "" },
  });
  const [error, setError] = useState<string | null>(null);
  const { image, pickImage, uploadImage, uploading } = useImageUpload();
  const [loading, setLoading] = useState(false);

  // 🔼 Unified function to handle all input changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const keys = field.split(".") as [("name" | "location" | "timings"), ("open" | "close")?];
      if (keys[0] === "name" || keys[0] === "location") {
        return { ...prev, [field]: value };
      } else {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            ...(keys[1] ? { [keys[1]]: value } : {}),
          },
        };
      }
    });
  };

  // 🔼 Handle Form Submission
  const onSubmit = async () => {
    try {
      if (!formData.name || !formData.location || !formData.timings.open || !formData.timings.close) {
        setError("All fields are required");
        return;
      }
      setLoading(true)
      const user = await addMemberToFirestore("canteen");
      if (!user) {
        throw new Error('User not found');
      }
      const imageURL = await uploadImage();
      const canteenData = { ...formData, image: imageURL || "", owner: user.uid };
      const result = await registerCanteen(canteenData);
      if (result.success) {
        Alert.alert("Success", "Canteen registered successfully!");
        setFormData({ name: "", location: "", timings: { open: "", close: "" } });
      } else {
        throw new Error("Firestore error");
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to register canteen.");
      setError(error.message || "Failed to register canteen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? <ActivityIndicator size="large" color={theme.colors.primary} /> :
        <View>
          <Text style={styles.title}>Register Canteen</Text>

          {/* Name Input */}
          <TextInput
            label="Canteen Name"
            mode="outlined"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          {/* Location Input */}
          <TextInput
            label="Location"
            mode="outlined"
            value={formData.location}
            onChangeText={(text) => handleChange("location", text)}
          />

          {/* Opening & Closing Time Inputs */}
          <TextInput
            label="Opening Time"
            mode="outlined"
            value={formData.timings.open}
            onChangeText={(text) => handleChange("timings.open", text)}
          />
          <TextInput
            label="Closing Time"
            mode="outlined"
            value={formData.timings.close}
            onChangeText={(text) => handleChange("timings.close", text)}
          />

          {/* Image Picker */}
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style={styles.text}>{image ? "Select a different image" : "Select Canteen Image"}</Text>
          </TouchableOpacity>

          {/* Display Selected Image */}
          <View style={{ display: "flex", alignItems: "center" }}>
            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={onSubmit} style={[styles.submitButton, uploading && { opacity: 0.5 }]} disabled={uploading}>
            <Ionicons name="logo-google" color="white" style={styles.buttonIcon} />
            <Text style={styles.text}>  Continue with Google</Text>
          </TouchableOpacity>

          {error && <Text style={{ color: theme.colors.error, textAlign: "center" }}>{error}</Text>}
          <Text style={{ textAlign: "center" , marginTop: 10, fontSize: 14 }}>
            Already have an account?{" "}
            <Link href={"/auth/login"} style={styles.link}>Login</Link>
          </Text>
        </View>}
    </SafeAreaView>
  );
};

export default CanteenSignUpScreen;

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      gap: 10,
      padding: 20,
      backgroundColor: "#00000000",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.colors.onBackground,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      padding: 10,
      alignItems: "center",
      marginVertical: 10,
    },
    buttonIcon: {
      fontSize: 18,
    },
    submitButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      marginTop: 20,
      padding: 10,
    },
    text: {
      textAlign: "center",
      color: theme.colors.onPrimary,
      fontWeight: "bold",
      fontSize: 16,
    },
    link: {
      color: "#4a1e1e",
      textDecorationLine: "underline",
      fontWeight: "bold",
    },
  });

