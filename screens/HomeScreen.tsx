import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import CustomButton from '../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation parameter list
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

// Define the navigation prop type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Define props for the HomeScreen component
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

// Background image path (ensure it's in your assets folder)
const backgroundImage = require('../assets/background.jpeg');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Prediction App</Text>
        <CustomButton
          title="Login"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
        <CustomButton
          title="Register"
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
        />
         <CustomButton
          title="WeedGuard"
          onPress={() => navigation.navigate('WeedGuard')}
          style={styles.button}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire background
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for better readability
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
    width: '80%',
  },
});

export default HomeScreen;
