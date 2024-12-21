import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        console.log('Token retrieved in useToken hook:', storedToken); // Log the token for debugging
        setToken(storedToken);  // Set the token in state
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    getToken();
  }, []); // Only run once, when the component mounts

  const storeToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('accessToken', newToken);
      console.log('Token stored in AsyncStorage:', newToken); // Log for debugging
      setToken(newToken);  // Update state after storing
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  return { token, storeToken };
};
