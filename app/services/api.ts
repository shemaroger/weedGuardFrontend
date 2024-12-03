import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.3.116:8000/api/';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include authentication tokens
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Retrieved token:', token); // Log the token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No token found');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `Response Error: Status ${error.response.status} - ${error.response.data.detail || error.message}`
      );
      if (error.response.status === 401) {
        console.warn('Unauthorized. Redirecting to login...');
        // Optional: Redirect to the login screen or clear stored tokens
      }
    } else {
      console.error('Response Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
