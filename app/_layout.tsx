import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';



const Layout: React.FC = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  </SafeAreaProvider>
);

export default Layout;
