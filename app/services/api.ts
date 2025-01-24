import axios from 'axios';
import { saveTokens, getTokens, deleteTokens } from './TokenManager';

// Define your API base URL
const API_BASE_URL = 'http://192.168.8.107:8000/api/';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to attach the token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    if (tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      console.log('Authorization header added:', config.headers['Authorization']); // Debugging
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors (e.g., token expiration, refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      const tokens = await getTokens();
      if (tokens?.refreshToken) {
        try {
          // Attempt to refresh the token
          const refreshResponse = await axios.post(`${API_BASE_URL}refresh-token/`, {
            refresh_token: tokens.refreshToken,
          });

          const { access_token, refresh_token } = refreshResponse.data;

          // Save the new tokens
          await saveTokens(access_token, refresh_token);

          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refresh fails, delete tokens and log out the user
          await deleteTokens();
          console.log('Token refresh failed. Logging out...');
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;