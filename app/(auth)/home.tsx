import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/context/AuthContext';

export default function Page() {
    const { user, signOut } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            {user ? (
                <>
                    <Text style={styles.welcomeText}>Welcome, {user.user.name}!</Text>
                    <View style={styles.userInfo}>
                        <Text style={styles.infoText}>Email: {user.user.email}</Text>
                    </View>
                    <Button title="Sign Out" onPress={signOut} color="#d9534f" />
                </>
            ) : (
                <Text style={styles.infoText}>No user signed in</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userInfo: {
        marginBottom: 20,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#555',
    },
});
