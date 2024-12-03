import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Tab Navigator
export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Predictions: undefined;
};

// Drawer Navigator
export type DrawerParamList = {
  Tabs: undefined;
  Register: { email?: string };
  Login: undefined;
  Settings: undefined;
};

// Root Tab Navigator (Updated to include PredictionDetails)
export type RootTabParamList = {
  Home: undefined;
  PredictionsList: undefined;
  PredictUpload: undefined;
  PredictionDetails: { id: string }; // Added with id parameter
  Profile: undefined;
  Settings: undefined;
};

// Root Stack Navigator
export type RootStackParamList = {
  AuthLoading: undefined;
  Tabs: undefined;
  Login: undefined;
  Register: { email?: string };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Navigation Prop Types
export type TabNavigationPropType = BottomTabNavigationProp<TabParamList>;
export type DrawerNavigationPropType = DrawerNavigationProp<DrawerParamList>;
export type StackNavigationPropType = StackNavigationProp<RootStackParamList>;
export type RootTabNavigationPropType = BottomTabNavigationProp<RootTabParamList>;

// Route Prop Types
export type TabRoutePropType<T extends keyof TabParamList> = RouteProp<TabParamList, T>;
export type DrawerRoutePropType<T extends keyof DrawerParamList> = RouteProp<DrawerParamList, T>;
export type StackRoutePropType<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
export type RootTabRoutePropType<T extends keyof RootTabParamList> = RouteProp<RootTabParamList, T>;

// Screen Props Types
export type TabScreenProps<T extends keyof TabParamList> = {
  navigation: TabNavigationPropType;
  route: TabRoutePropType<T>;
};

export type DrawerScreenProps<T extends keyof DrawerParamList> = {
  navigation: DrawerNavigationPropType;
  route: DrawerRoutePropType<T>;
};

export type StackScreenProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationPropType;
  route: StackRoutePropType<T>;
};

// Specific Props for PredictionDetails Screen
export type PredictionDetailsScreenProps = {
  navigation: RootTabNavigationPropType;
  route: RootTabRoutePropType<'PredictionDetails'>;
};

// Utility Type for Optional Params
export type OptionalParams<T> = {
  [K in keyof T]?: T[K];
};