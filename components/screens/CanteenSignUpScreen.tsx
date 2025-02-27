import React from "react";
import { Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { registerCanteen } from "@/lib/services/firestoreService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";  
import { Theme } from "@/constants/Theme";

const CanteenSignUpScreen : React.FC = ({ navigation }: any) => {
  const { control, handleSubmit, reset } = useForm();
  const { image, pickImage, uploadImage, uploading } = useImageUpload();
  const theme = useTheme();
  const styles = createStyles(theme);

  const onSubmit = async (data: any) => {
    try {
      const imageURL = await uploadImage();
      const canteenData = { ...data, image: imageURL || "" };

      const result = await registerCanteen(canteenData);
      if (result.success) {
        Alert.alert("Success", "Canteen registered successfully!");
        reset();
        navigation.navigate("Home");
      } else {
        throw new Error("Firestore error");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to register canteen.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Canteen Sign-Up</Text>

      {/* Name Input */}
      <Controller
        control={control}
        name="name"
        rules={{ required: "Canteen name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Canteen Name" value={value} onChangeText={onChange} style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} />
        )}
      />

      {/* Location Input */}
      <Controller
        control={control}
        name="location"
        rules={{ required: "Location is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Location" value={value} onChangeText={onChange} style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} />
        )}
      />

      {/* Opening & Closing Time */}
      <Controller
        control={control}
        name="timings.open"
        rules={{ required: "Opening time is required" }}
        render={({ field }) => <TextInput placeholder="Opening Time" {...field} style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} />}
      />
      <Controller
        control={control}
        name="timings.close"
        rules={{ required: "Closing time is required" }}
        render={({ field }) => <TextInput placeholder="Closing Time" {...field} style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} />}
      />

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10, alignItems: "center" }}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Text style={{ color: "blue" }}>Select Canteen Image</Text>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <Button title={uploading ? "Uploading..." : "Register Canteen"} onPress={handleSubmit(onSubmit)} disabled={uploading} />
    </SafeAreaView>
  );
}

export default CanteenSignUpScreen;

const createStyles = (theme : Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.colors.onBackground,
    },
    input: {
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      color: theme.colors.onBackground,
      backgroundColor: theme.colors.surface,
    },
  });
};
