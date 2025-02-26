import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/context/AuthContext';
import SettingsScreen from '@/components/screens/SettingsScreen';
import { useTheme } from '@/lib/hooks/useTheme';

export default function Page() {
  const { user, signOut } = useAuth();
  const styles = createStyles(); 
  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Welcome, {user.user.name}!</Text>
          <View style={styles.userInfo}>
            <Text style={styles.infoText}>Email: {user.user.email}</Text>
            <Button title="Sign Out" onPress={signOut} color="#d9534f" />
          </View>
          <SettingsScreen />
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </SafeAreaView>
  );
}

const createStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },
    welcomeText: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.foreground,
    },
    userInfo: {
      marginBottom: 20,
      alignItems: 'center',
    },
    infoText: {
      fontSize: 16,
      color: theme.mutedForeground,
      marginBottom: 20,
    },
  });
  return styles;
}
