import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './(tabs)/HomeScreen';
import PredictionsListScreen from './(tabs)/PredictionsListScreen';
import PredictUploadScreen from './(tabs)/PredictUploadScreen';
import PredictionDetailsScreen from './(tabs)/PredictionDetailsScreen';
import Header from './components/Header';
import { NavigationContainer } from '@react-navigation/native'; // Ensure you wrap the TabNavigator in a NavigationContainer

// Define the Tab Navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName="Home" // Set "Home" as the initial route
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          // Determine the icon name based on the route
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'PredictionsList':
              iconName = 'list-alt'; // Example icon for Predictions List
              break;
            case 'PredictUpload':
              iconName = 'cloud-upload'; // Example icon for Predict Upload
              break;
            case 'PredictionDetails':
              iconName = 'info'; // Example icon for Prediction Details
              break;
            default:
              iconName = 'home';
          }

          // Render the tab icon
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000000', // Black color for the active tab
        tabBarInactiveTintColor: '#FFFFFF', // White color for inactive tabs
        tabBarStyle: {
          backgroundColor: '#0EA340', // Green background for the tab bar
        },
        header: () => <Header />, // Custom header component
      })}
    >
      {/* Define the screens for the tab navigator */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }} // Set screen title
      />
      <Tab.Screen
        name="PredictionsList"
        component={PredictionsListScreen}
        options={{ title: 'Predictions List' }} // Set screen title
      />
      <Tab.Screen
        name="PredictUpload"
        component={PredictUploadScreen}
        options={{ title: 'Upload Prediction' }} // Set screen title
      />
      <Tab.Screen
        name="PredictionDetails"
        component={PredictionDetailsScreen}
        options={{ title: 'Prediction Details' }} // Set screen title
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default TabNavigator;
