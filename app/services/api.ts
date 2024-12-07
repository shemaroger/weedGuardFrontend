import axios from 'axios';
import { saveTokens, getTokens, deleteTokens } from './TokenManager';

// Define your API base URL
const API_BASE_URL = 'http://192.168.3.116:8000/api/';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to add the token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();

    console.log('Retrieved tokens:', tokens);

    if (tokens && tokens.accessToken) {
      // If access token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      console.log('Authorization header set with access token.');
    } else {
      console.log('No access token found, skipping Authorization header.');
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors (e.g., token expiration, refresh)
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response; // return response as is if successful
  },
  async (error) => {
    const originalRequest = error.config;

    console.log('Response error received:', error.response);

    // Check if the error is due to an expired access token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Token expired, attempting to refresh...');

      const tokens = await getTokens();
      console.log('Retrieved tokens for refresh:', tokens);

      // If refresh token is available, attempt to refresh access token
      if (tokens && tokens.refreshToken) {
        try {
          console.log('Sending refresh token request...');
          const refreshResponse = await axios.post(`${API_BASE_URL}/refresh-token`, {
            refresh_token: tokens.refreshToken,
          });

          const { access_token, refresh_token } = refreshResponse.data;
          console.log('Received new tokens:', { access_token, refresh_token });

          // Save the new tokens
          await saveTokens(access_token, refresh_token);
          console.log('New tokens saved successfully.');

          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
          // If token refresh fails, log out the user and delete tokens
          await deleteTokens();
          console.log('Token refresh failed. Logging out...');
          return Promise.reject(refreshError);
        }
      }
    }

    // For other errors, reject the promise with the error
    console.error('API request failed:', error);
    return Promise.reject(error);
  }
);

// Function to make API requests (GET, POST, etc.)
export const makeRequest = async (method: string, url: string, data?: any) => {
  try {
    console.log(`Making API request: ${method.toUpperCase()} ${url}`, data);

    const response = await apiClient({
      method,
      url,
      data,
    });
    console.log('API request successful:', response.data);

    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default apiClient;
