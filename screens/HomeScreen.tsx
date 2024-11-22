import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Prediction App</Text>
      <CustomButton title="Login" onPress={() => navigation.navigate('Login')} />
      <CustomButton title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
