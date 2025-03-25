import { View, Text } from 'react-native'
import React from 'react'
import SettingsScreen from './SettingsScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

const CanteenHomeScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <Text>CanteenHomeScreen</Text>
                <SettingsScreen />
            </View>
        </SafeAreaView>
    )
}

export default CanteenHomeScreen