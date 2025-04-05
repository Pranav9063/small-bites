import React, { useState, useRef, useEffect } from "react";
import { Text, Alert, TouchableOpacity, Image, View, StyleSheet, ScrollView, Dimensions, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, TextInput, useTheme } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { addCanteenOwnerToFirestore, registerCanteen } from "@/lib/services/firestoreService";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Theme } from "@/constants/Theme";

const { width, height } = Dimensions.get('window');

const CanteenSignUpScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    timings: { open: "", close: "" },
  });
  const [error, setError] = useState<string | null>(null);
  const { image, pickImage, uploadImage, uploading } = useImageUpload();
  const [loading, setLoading] = useState(false);

  // Animations for fade and slide-in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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

  const onSubmit = async () => {
    try {
      if (!formData.name || !formData.location || !formData.timings.open || !formData.timings.close) {
        setError("All fields are required");
        return;
      }
      setLoading(true);
      const imageURL = await uploadImage();
      const canteenData = { ...formData, image: imageURL || "" };
      const result = await registerCanteen(canteenData);
      if (!result.id) {
        throw new Error("Failed to add to firestore");
      }
      const res = await addCanteenOwnerToFirestore(result.id);
      if (res.success) {
        Alert.alert("Success", "Canteen registered successfully!");
        setFormData({ name: "", location: "", timings: { open: "", close: "" } });
      } else {
        throw new Error("Firestore error");
      }
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", "Failed to register canteen.");
      setError(error.message || "Failed to register canteen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Please wait a moment</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Image source={require("@/assets/images/icon.jpg")} style={styles.logo} />
            </View>
            
            {/* Heading & Subheading */}
            <Text style={styles.heading}>Register Your Canteen</Text>
            <Text style={styles.subheading}>
              Join Small Bites and showcase your delicious menu to campus students
            </Text>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="restaurant" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                <TextInput
                  label="Canteen Name"
                  mode="outlined"
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  style={styles.input}
                  outlineColor="#ddd"
                  activeOutlineColor={theme.colors.primary}
                />
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons name="location-on" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                <TextInput
                  label="Location"
                  mode="outlined"
                  value={formData.location}
                  onChangeText={(text) => handleChange("location", text)}
                  style={styles.input}
                  outlineColor="#ddd"
                  activeOutlineColor={theme.colors.primary}
                />
              </View>

              <View style={styles.timeInputRow}>
                <View style={[styles.inputWrapper, styles.timeInputWrapper]}>
                  <MaterialIcons name="access-time" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    label="Opening Time"
                    mode="outlined"
                    value={formData.timings.open}
                    onChangeText={(text) => handleChange("timings.open", text)}
                    style={styles.input}
                    outlineColor="#ddd"
                    activeOutlineColor={theme.colors.primary}
                  />
                </View>
                <View style={[styles.inputWrapper, styles.timeInputWrapper]}>
                  <MaterialIcons name="access-time" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    label="Closing Time"
                    mode="outlined"
                    value={formData.timings.close}
                    onChangeText={(text) => handleChange("timings.close", text)}
                    style={styles.input}
                    outlineColor="#ddd"
                    activeOutlineColor={theme.colors.primary}
                  />
                </View>
              </View>

              <View style={styles.imageSection}>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.selectedImage} />
                  ) : (
                    <View style={styles.imagePickerPlaceholder}>
                      <MaterialIcons name="add-a-photo" size={36} color={theme.colors.primary} />
                      <Text style={styles.imagePickerText}>Add Canteen Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {image && (
                  <TouchableOpacity onPress={pickImage} style={styles.changeImageButton}>
                    <MaterialIcons name="edit" size={20}/>
                  </TouchableOpacity>
                )}
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity 
                onPress={onSubmit} 
                style={[styles.submitButton, (uploading) && styles.disabledButton]} 
                disabled={uploading}
              >
                <Ionicons name="logo-google" color="white" size={20} />
                <Text style={styles.submitButtonText}>Register with Google</Text>
              </TouchableOpacity>

              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Link href={"/auth/login"} style={styles.loginLink}>Login</Link>
              </Text>
            </View>
          </ScrollView>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: "#fff",
    },
    innerContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      width: '100%',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    logo: {
      width: width * 0.35,
      height: width * 0.35,
      borderRadius: width * 0.175,
      backgroundColor: '#f5f5f5',
    },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 12,
      textAlign: "center",
    },
    subheading: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 22,
      alignSelf: 'center',
    },
    formContainer: {
      width: '100%',
    },
    inputWrapper: {
      width: '100%',
      marginBottom: 16,
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeInputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    timeInputWrapper: {
      flex: 0.48,
    },
    inputIcon: {
      position: 'absolute',
      left: 12,
      top: 20,
      zIndex: 1,
    },
    input: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingLeft: 30,
    },
    imageSection: {
      position: "relative",
      alignItems: 'center',
      marginVertical: 10,
    },
    imagePicker: {
      width: width * 0.5,
      height: width * 0.35,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
      borderWidth: 2,
      borderColor: '#ddd',
      borderStyle: 'dashed',
    },
    imagePickerPlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imagePickerText: {
      marginTop: 8,
      color: '#888',
      fontSize: 14,
      textAlign: 'center',
    },
    changeImageButton: {
      position: "absolute",
      zIndex: 1,
      bottom: 10,
      right: 95,
      marginTop: 12,
      padding: 5,
      alignSelf: 'center',
      backgroundColor: "white",
      borderRadius: "50%"
    },
    changeImageText: {
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 14,
    },
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      marginTop: 10,
    },
    disabledButton: {
      opacity: 0.5,
    },
    submitButtonText: {
      marginLeft: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    errorText: {
      color: '#f44336',
      textAlign: 'center',
      marginTop: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 16,
    },
    loginText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 14,
      color: "#666",
    },
    loginLink: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });

export default CanteenSignUpScreen;
