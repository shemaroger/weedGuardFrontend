import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import RegisterScreen from './(auth)/RegisterScreen';
import LoginScreen from './(auth)/LoginScreen';
import PredictionsListScreen from './(tabs)/PredictionsListScreen';
import Header from './components/Header';  // Adjust the path if necessary
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerNavigationHelpers, DrawerDescriptorMap } from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerNavigationState, ParamListBase } from '@react-navigation/native';

// Custom Drawer Content
type CustomDrawerContentProps = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <Text style={styles.headerText}>WEED GUARD</Text>
    </View>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Login"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: true,
      drawerIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="menu" color={color} size={size} />
      ),
      drawerStyle: {
        backgroundColor: '#CBF9D0FF',
      },
      drawerActiveTintColor: '#57AA48FF',
      drawerInactiveTintColor: '#333',
    }}
  >
    <Drawer.Screen 
      name="Tabs"
      component={TabNavigator}
      options={{
        title: 'Home',
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Drawer.Screen 
      name="Login"
      component={LoginScreen}
      options={{
        title: 'Login',
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="login" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Drawer.Screen 
      name="Register"
      component={RegisterScreen}
      options={{
        title: 'Register',
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account-plus" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Drawer.Screen 
      name="PredictionsListScreen"
      component={PredictionsListScreen}
      options={{
        title: 'WeedGuard',
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
        ),
        header: () => <Header title="PredictionsListScreen" />,
      }}
    />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#086805FF',
  },
  headerText: {
    fontSize: 24,
    color: '#000',
  },
});

export default DrawerNavigator;
