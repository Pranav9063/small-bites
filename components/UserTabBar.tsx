import { View, Text } from 'react-native'
import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

const UserTabBar = ({state , descriptors, navigation, insets} : BottomTabBarProps) => {
  return (
    <View>
      <Text>UserTabBar</Text>
    </View>
  )
}

export default UserTabBar