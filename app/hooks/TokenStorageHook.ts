import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom hook to handle the token
export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        console.log('Token retrieved in useToken hook:', storedToken);
        setToken(storedToken);  // Set the token in the state
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    getToken();
  }, []); // Empty array ensures this runs only on mount

  const storeToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('accessToken', newToken);
      console.log('Token stored in AsyncStorage:', newToken);
      setToken(newToken);  // Update the state with the new token
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  return { token, storeToken };
};
