import AsyncStorage from '@react-native-async-storage/async-storage';

// Save tokens to AsyncStorage
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    return true;
  } catch (error) {
    console.error('Failed to save tokens:', error);
    return false;
  }
};

// Retrieve tokens from AsyncStorage
export const getTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Failed to retrieve tokens:', error);
    return null;
  }
};

// Delete tokens from AsyncStorage
export const deleteTokens = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    return true;
  } catch (error) {
    console.error('Failed to delete tokens:', error);
    return false;
  }
};