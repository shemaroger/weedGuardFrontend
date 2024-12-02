import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './(tabs)/HomeScreen';
import PredictionsListScreen from './(tabs)/PredictionsListScreen';
import PredictUploadScreen from './(tabs)/PredictUploadScreen';
// import PredictionDetailsScreen from './(tabs)/PredictionDetailsScreen';
import Header from './components/Header';
import { NavigationContainer } from '@react-navigation/native';

// Define the Tab Navigator and Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// const PredictionStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="PredictionDetails"
//       component={PredictionDetailsScreen}
//       options={{ title: 'Prediction Details' }}
//     />
//   </Stack.Navigator>
// );

const TabNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'PredictionsList':
              iconName = 'list-alt';
              break;
            case 'PredictUpload':
              iconName = 'cloud-upload';
              break;
            // case 'PredictionDetails':
            //   iconName = 'info';
            //   break;
            default:
              iconName = 'home';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: { backgroundColor: '#0EA340' },
        header: () => <Header />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="PredictionsList"
        component={PredictionsListScreen}
        options={{ title: 'Predictions List' }}
      />
      <Tab.Screen
        name="PredictUpload"
        component={PredictUploadScreen}
        options={{ title: 'Upload Prediction' }}
      />
      {/* <Tab.Screen
        name="PredictionDetails"
        component={PredictionStack}
        options={{ title: 'Prediction Details' }}
      /> */}
    </Tab.Navigator>
  </NavigationContainer>
);

export default TabNavigator;
