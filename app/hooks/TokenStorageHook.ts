// TokenStorageHook.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STORAGE_KEY = 'accessToken';

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeToken = async () => {
      setIsLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        console.log('Initial token retrieval:', storedToken);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error during token initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeToken();
  }, []);

  const storeToken = async (newToken: string) => {
    try {
      if (!newToken) {
        console.warn('Attempted to store null/empty token');
        return false;
      }
      
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      console.log('Successfully stored new token:', newToken);
      setToken(newToken);
      return true;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  };

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      return true;
    } catch (error) {
      console.error('Error clearing token:', error);
      return false;
    }
  };

  return { 
    token, 
    storeToken, 
    clearToken,
    isLoading 
  };
};