import { View, Text, Button } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function Page() {
    const user = auth().currentUser;
    const signOut = async () => {
        try {
            // Sign out from Firebase
            await auth().signOut();

            // Sign out from Google
            await GoogleSignin.signOut();

            alert('Sign out successful!');
        } catch (error) {
            console.error('Error signing out: ', error);
            alert('Failed to sign out. Please try again.');
        }
    };

    return (
        <View>
            <Text>Welcome {user?.displayName}</Text>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    );
}