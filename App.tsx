import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import PredictionScreen from './screens/PredictionScreen';
import RegisterScreen from './screens/RegisterScreen';

// Define parameter types for the navigator
export type RootStackParamList = {
  Home: undefined;
  Login: { redirectTo?: string };
  Prediction: { predictionData?: string };
  Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const isAuthenticated = false; // Replace with real auth state

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome Home' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Prediction" component={PredictionScreen} options={{ title: 'Prediction' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
