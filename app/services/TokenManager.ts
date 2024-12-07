import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

export const getTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return null;
  }
};

export const deleteTokens = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Error deleting tokens:', error);
  }
};
