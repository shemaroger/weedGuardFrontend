// utils/authUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api'; // Your Axios instance

// Function to get the access token
export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

// Function to remove all tokens (clear user session)
export const clearSession = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};

// Function to attempt to refresh the access token
export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await apiClient.post<{ accessToken: string }>('auth/refresh/', { refreshToken });
    const newAccessToken = response.data.accessToken;
    await AsyncStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
};
