import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';

// Tab Navigator
export type TabParamList = {
  Home: undefined;
  'Send SMS': undefined;
  'Normal SMS': undefined;  // Normal SMS screen
  'Spam SMS': undefined;    // Spam SMS screen
};

// Drawer Navigator
export type DrawerParamList = {
  Tabs: undefined;
  Register: undefined;
  Login: undefined;
  Analysis: undefined;
};

// Root Stack Navigator (combines both Drawer and Tab navigators)
export type RootStackParamList = {
  AuthLoading: undefined;
  Tabs: undefined;   // For Drawer navigator's Tabs screen
  Login: undefined;
  Register: undefined;
};

// Tab Navigation Props
export type TabNavigationPropType = BottomTabNavigationProp<TabParamList>;

// Drawer Navigation Props
export type DrawerNavigationPropType = DrawerNavigationProp<DrawerParamList>;

// Stack Navigation Props
export type StackNavigationPropType = StackNavigationProp<RootStackParamList>;
