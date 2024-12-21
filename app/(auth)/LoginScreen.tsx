import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteTokens } from '../services/TokenManager';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: { screen: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp>();

  // Function to validate email format
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  // Login handler
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('login/', { email, password });

      if (response.data?.access_token) {
        // Store tokens securely in AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.access_token);
        // Store the refresh token if available
        if (response.data.refresh_token) {
          await AsyncStorage.setItem('refreshToken', response.data.refresh_token);
        }
        // Navigate to the home screen
        navigation.navigate('Tabs', { screen: 'Home' });
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail); // Show specific error from the backend
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear error message when user starts typing
  const handleChangeEmail = (text: string) => {
    setEmail(text);
    setError(null); // Clear error on input change
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
    setError(null); // Clear error on input change
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Email"
              value={email}
              onChangeText={handleChangeEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Password"
              value={password}
              onChangeText={handleChangePassword}
              secureTextEntry
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.loginButtonText}>Log In</Text>}
            </TouchableOpacity>
          </View>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#328A43FF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    backgroundColor: '#026514FF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#D1D1E9',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#0A5B06FF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonDisabled: {
    backgroundColor: '#B8B8B8',
  },
  loginButtonText: {
    color: '#1E1E2F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    color: 'red',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  signupText: {
    color: '#D1D1E9',
    fontSize: 16,
  },
  signupLink: {
    color: '#FFFFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

