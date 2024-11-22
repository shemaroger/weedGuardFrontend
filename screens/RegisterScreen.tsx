import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

// Props for the RegisterScreen
interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp; // Explicitly define the navigation prop
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const response = await axios.post('https://yourapi.com/register', { name, email, password });
      console.log(response.data);

      Alert.alert('Success', 'Registration successful! Please log in.');
      navigation.navigate('Login'); // Navigate to the Login screen after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <CustomInput label="Name" value={name} onChangeText={setName} />
      <CustomInput label="Email" value={email} onChangeText={setEmail} />
      <CustomInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomButton title="Register" onPress={handleRegister} />
      <CustomButton title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default RegisterScreen;
