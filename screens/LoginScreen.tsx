import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the parameter list for your navigation
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Prediction: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// Props for the LoginScreen
interface LoginScreenProps {
  navigation: LoginScreenNavigationProp; // Explicitly define the navigation prop
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://yourapi.com/login', { email, password });
      console.log(response.data);
      // If login is successful, navigate to the home or prediction screen
      navigation.navigate('Prediction'); // Or whatever screen you need to go to
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <CustomInput label="Email" value={email} onChangeText={setEmail} />
      <CustomInput label="Password" value={password} onChangeText={setPassword} />
      <CustomButton title="Login" onPress={handleLogin} />
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

export default LoginScreen;
