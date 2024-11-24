import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import axios, { AxiosError } from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Prediction: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Axios instance with baseURL
  const axiosInstance = axios.create({
    baseURL: 'http://172.20.10.4:8000', // Update this with your backend server's address
    timeout: 20000, // 20 seconds timeout
  });

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to register:', { name, email, password });
      const response = await axiosInstance.post('/api/users/', { name, email, password });
      console.log('Server Response:', response.data);
      Alert.alert('Success', 'Registration successful! Please log in.');
      navigation.navigate('Login');
    } catch (err) {
      const error = err as AxiosError;
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.toJSON());
        if (!error.response) {
          Alert.alert('Connection Error', 'Check your internet connection and try again.');
        } else {
          const errorMessage =
            error.response.data?.detail ||
            'Registration failed due to an issue on the server. Please try again later.';
          Alert.alert('Error', errorMessage);
        }
      } else {
        console.error('Unexpected Error:', err);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('http://172.20.10.4:8000/');
      if (response.ok) {
        console.log('Connection Test Successful:', response.status);
        Alert.alert('Success', 'Backend server is reachable.');
      } else {
        console.error('Connection Test Failed:', response.status);
        Alert.alert('Error', 'Unable to reach backend server. Check the URL or server status.');
      }
    } catch (error) {
      console.error('Connection Test Error:', error);
      Alert.alert('Error', 'Network test failed. Check your connection.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <CustomInput label="Name" value={name} onChangeText={setName} editable={!isLoading} />
      <CustomInput label="Email" value={email} onChangeText={setEmail} editable={!isLoading} />
      <CustomInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <CustomButton
        title={isLoading ? 'Registering...' : 'Register'}
        onPress={handleRegister}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <CustomButton
        title="Test Connection"
        onPress={testConnection}
        disabled={isLoading}
      />
      <CustomButton
        title="Back to Login"
        onPress={() => navigation.navigate('Login')}
        disabled={isLoading}
      />
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RegisterScreen;


