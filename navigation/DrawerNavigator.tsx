// DrawerNavigator.tsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator'; // Import TabNavigator
import LoginScreen from '../screens/LoginScreen'; // Import LoginScreen

// Define the type for the Drawer Navigator's screen parameters
export type DrawerNavigatorParamList = {
  Home: undefined;
  Login: undefined;
};

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>(); // Define Drawer Navigator with the type

const DrawerNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={TabNavigator} />
        <Drawer.Screen name="Login" component={LoginScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
