import SettingsScreen from '@/components/screens/SettingsScreen';
import { Theme } from '@/constants/Colors';
import { useAuth } from '@/lib/context/AuthContext';
import { useTheme } from '@/lib/hooks/useTheme';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Page: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme(); // Moved useTheme hook here
  const styles = createStyles(theme); // Pass theme to createStyles

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
};

export default Page;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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