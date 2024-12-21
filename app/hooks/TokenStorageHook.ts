// TokenStorageHook.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        if (isMounted) {
          console.log('Token retrieved in useToken hook:', storedToken);
          setToken(storedToken);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const storeToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('accessToken', newToken);
      console.log('Token stored in AsyncStorage:', newToken);
      setToken(newToken);
      return true;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  };

  return { token, storeToken, isLoading };
};
