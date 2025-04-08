import { View, Text, StyleSheet, } from 'react-native'
import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { PlatformPressable } from '@react-navigation/elements'
import { useLinkBuilder } from '@react-navigation/native'
import { EdgeInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'


const UserTabBar = ({ state, descriptors, navigation, insets }: BottomTabBarProps) => {
  const { buildHref } = useLinkBuilder();
  const styles = createStyles(insets);

  interface IconProps {
    color?: string;
    size?: number;
  }

  interface Icons {
    index: (props: IconProps) => JSX.Element;
    favourites: (props: IconProps) => JSX.Element;
    orders: (props: IconProps) => JSX.Element;
    expenses: (props: IconProps) => JSX.Element;
    profile: (props: IconProps) => JSX.Element;
  }

  const icons: Icons = {
    index: (props) => <Ionicons name="grid" size={24} color="#007AFF" {...props} />,
    favourites: (props) => <Ionicons name="heart-outline" size={24} color="#666" {...props} />,
    orders: (props) => <Ionicons name="receipt-outline" size={24} color="#666" {...props} />,
    expenses: (props) => <Ionicons name="cash-outline" size={24} color="#666" {...props} />,
    profile: (props) => <Ionicons name="person-outline" size={24} color="#666" {...props} />,
  };
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const color = isFocused ? '#4A90E2' : '#666';
        if (route.name == 'index') {
          return (
            <PlatformPressable
              key={index}
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              android_ripple={{ color: 'white' }}
            >
              <View style={[styles.centerButton, styles.centerButtonGradient]}>
                {icons[route.name as keyof Icons] ? icons[route.name as keyof Icons]({ color: 'white', size: 24 }) : null}
              </View>
            </PlatformPressable>
          )
        }

        return (
          <PlatformPressable
            key={index}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            android_ripple={{ color: 'white' }}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={styles.tabIcon}>
              {
                icons[route.name as keyof Icons] ? icons[route.name as keyof Icons]({ color, size: 24 }) : null
              }
            </View>
            <Text style={[styles.tabLabel, { color: color }]}>
              {typeof label === 'function' ? label({ focused: isFocused, color: color, position: 'below-icon', children: '' }) : label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  )
}

const createStyles = (insets: EdgeInsets) => {
  return StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    },
    tabItem: {
      // flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // paddingVertical: 10,
      fontSize: 12,
    },
    tabIcon: {
      marginBottom: 5,
    },
    tabLabel: {
      fontSize: 12,
    },
    centerButton: {
      marginTop: -30,
    },
    centerButtonGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  });
}

export default UserTabBar