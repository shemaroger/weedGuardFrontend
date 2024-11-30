// TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; // Import HomeScreen
import WeedGuardScreen from '../screens/WeedGuardScreen'; // Import WeedGuardScreen

// Define the type for the Tab Navigator's screen parameters
export type TabNavigatorParamList = {
  Home: undefined;
  'Weed Guard': undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParamList>(); // Define Tab Navigator with the type

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Weed Guard" component={WeedGuardScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
