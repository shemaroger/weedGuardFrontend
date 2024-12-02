import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './(tabs)/HomeScreen';
import WeedGuardScreen from './(tabs)/WeedGuardScreen';
import Header from './components/Header';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home" // Home is the initial route
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'WeedGuard':
            iconName = 'WeedGuard';
            break;
          default:
            iconName = 'home';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000000', // Black for active tab
      tabBarInactiveTintColor: '#FFFFFF', // White for inactive tab
      tabBarStyle: {
        backgroundColor: '#0EA340FF', // Dark Yellow
      },
      header: () => <Header />, // Custom header component
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Weed Guard" component={WeedGuardScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
