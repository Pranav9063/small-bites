import CanteenSignUpScreen from '@/components/screens/CanteenSignUpScreen';
import { Theme } from '@/constants/Colors';
import { useTheme } from '@/lib/hooks/useTheme';
import React from 'react';
import { View, Text, Button } from 'react-native';

const canteenLoginScreen = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View>
            <Text>Canteen Login</Text>
            <CanteenSignUpScreen />
        </View>
    );
};

export default canteenLoginScreen;

function createStyles(theme: Theme) {
    throw new Error('Function not implemented.');
}
