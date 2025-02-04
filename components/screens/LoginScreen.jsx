import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  SlideInUp,
} from "react-native-reanimated";

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?fit=crop&w=500&q=80",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay Gradient */}
        <LinearGradient
          colors={["rgba(255, 127, 80, 0.8)", "rgba(255, 69, 0, 0.9)"]}
          style={styles.overlay}
        >
          {/* App Logo */}
          <Animated.View entering={SlideInUp.duration(800)}>
            <Image
              source={{
                uri: "https://via.placeholder.com/150/FF4500/FFFFFF/?text=Logo",
              }}
              style={styles.logo}
            />
          </Animated.View>

          {/* App Name */}
          <Animated.Text
            entering={FadeIn.duration(1000)}
            style={styles.title}
          >
            Small Bites
          </Animated.Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Animated.View entering={FadeIn.delay(300).duration(1000)}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#FDF5E6"
                style={styles.input}
                keyboardType="email-address"
              />
            </Animated.View>

            <Animated.View entering={FadeIn.delay(500).duration(1000)}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#FDF5E6"
                style={styles.input}
                secureTextEntry
              />
            </Animated.View>
          </View>

          {/* Login Button */}
          <Animated.View entering={FadeIn.delay(700).duration(1000)}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.Text
            entering={FadeIn.delay(900).duration(1000)}
            style={styles.footer}
          >
            Don't have an account? Sign Up
          </Animated.Text>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    color: "#fff",
    fontSize: 14,
    marginTop: 20,
  },
});
