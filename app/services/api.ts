import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.8.107:8000/api/';
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Function to get access token
const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string> => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      isRefreshing = false;
      onRefreshed(access);
      return access;
    } catch (error) {
      isRefreshing = false;
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  return new Promise<string>((resolve) => {
    subscribeTokenRefresh(resolve);
  });
};

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    console.error('Response Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
