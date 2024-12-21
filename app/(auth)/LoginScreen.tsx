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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import apiClient from '../services/api';
import { useToken } from '../hooks/TokenStorageHook';

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
  const { storeToken } = useToken();

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleLogin = async () => {
    // Input validation
    if (!email.trim() || !password.trim()) {
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
      const response = await apiClient.post('login/', {
        email: email.trim(),
        password: password.trim(),
      });

      if (response.data?.access_token) {
        const token = response.data.access_token;
        console.log('Access Token received:', token);

        // Store token using the hook
        const storeSuccess = await storeToken(token);
        
        if (storeSuccess) {
          // Clear sensitive data
          setEmail('');
          setPassword('');
          
          // Navigate to home screen
          navigation.navigate('Tabs', { screen: 'Home' });
        } else {
          throw new Error('Failed to store authentication token');
        }
      } else {
        throw new Error('No access token received from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      
      // Show error in alert for visibility
      Alert.alert('Login Failed', error.response?.data?.detail || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = (text: string) => {
    setEmail(text);
    setError(null);
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
    setError(null);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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
              editable={!loading}
              autoCorrect={false}
              testID="email-input"
            />
            
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Password"
              value={password}
              onChangeText={handleChangePassword}
              secureTextEntry
              editable={!loading}
              testID="password-input"
            />
            
            {error && (
              <Text style={styles.errorText} testID="error-message">
                {error}
              </Text>
            )}
            
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              testID="login-button"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')}
              testID="signup-link"
            >
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
    color: '#FFFFFF',
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
    borderColor: '#FF3B30',
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;