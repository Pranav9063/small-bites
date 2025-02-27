import CanteenSignUpScreen from '@/components/screens/CanteenSignUpScreen';
import { Theme } from '@/constants/Theme';
import { useTheme } from 'react-native-paper';
import React from 'react';
import { View, Text } from 'react-native';

const CanteenLoginScreen = () => {
    const theme = useTheme();
    // const styles = createStyles(theme);
    return (
        <View>
            <Text>Canteen Login</Text>
            <CanteenSignUpScreen />
        </View>
    );
};

export default CanteenLoginScreen;

function createStyles(theme: Theme) {
    throw new Error('Function not implemented.');
}
