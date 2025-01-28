import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';

const LoginScreen = () => {
  return (
    <ImageBackground 
      source={require('@/assets/images/back.jpg')} // New background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {/* Logo and App Name */}
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/bg.jpg')} style={styles.logo} />
          <Text style={styles.appName}>Small Bites</Text>
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome Back!</Text>

        {/* Sign-In Button for Google */}
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.buttonText}>Sign In with Google</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    opacity: 0.4,  // Reduced opacity to create a subtle effect
    height: '100%',
    resizeMode: 'cover', // Ensuring the background stretches properly
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark overlay for contrast
    height: '100%',
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 15,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#FFFFFF',  // White border for logo
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',  // White text for app name
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',  // White text for welcome message
    marginBottom: 40,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInButton: {
    width: 300,
    height: 55,
    backgroundColor: '#FF6F00',  // Deep orange button color for call-to-action
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,  // Rounded corners for modern design
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',  // White border for contrast
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',  // White text on the button
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',  // White text for footer
    textAlign: 'center',
  },
  link: {
    color: '#4A90E2',  // Soft blue link color for contrast
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
