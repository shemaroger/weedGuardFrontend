import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      console.log('[RegisterScreen] Validation Error: Missing fields');
      return;
    }

    setIsLoading(true); // Show loading indicator

    try {
      console.log('[RegisterScreen] Attempting registration with:', {
        name,
        email,
        password,
      });

      const response = await axios.post(
        'http://192.168.3.116:8000/api/user/',
        {
          name,
          email,
          password,
        },
        {
          timeout: 10000, // Set timeout to 10 seconds
        }
      );

      console.log('[RegisterScreen] Registration successful:', response.data);
      Alert.alert('Success', 'Registration successful! Please log in.');

      navigation.navigate('Login'); // Navigate to the Login screen after successful registration
    } catch (error: any) {
      console.error('[RegisterScreen] Registration failed:', error);

      // Handle Axios network errors
      if (error.message === 'Network Error') {
        console.log('[RegisterScreen] Network Error details:', error);
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else if (error.response) {
        // Server responded with an error status code
        console.log('[RegisterScreen] Server responded with error:', {
          status: error.response.status,
          data: error.response.data,
        });

        Alert.alert('Error', error.response.data.detail || 'Registration failed. Please try again.');
      } else {
        // Other errors (e.g., timeout)
        console.log('[RegisterScreen] Other error details:', error);
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false); // Hide loading indicator after request
      console.log('[RegisterScreen] Registration request completed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <CustomInput label="Name" value={name} onChangeText={setName} />
      <CustomInput label="Email" value={email} onChangeText={setEmail} />
      <CustomInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomButton title="Register" onPress={handleRegister} />
      
      {/* Show loading indicator if registering */}
      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      
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
  loader: {
    marginVertical: 20,
  },
});

export default RegisterScreen;
