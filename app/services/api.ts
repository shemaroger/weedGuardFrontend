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

// Add an interceptor to add the token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();

    if (tokens && tokens.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
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

    if (error.response?.status === 401) {
      const tokens = await getTokens();
      if (tokens && tokens.refreshToken) {
        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}/refresh-token`, {
            refresh_token: tokens.refreshToken,
          });

          const { access_token, refresh_token } = refreshResponse.data;
          await saveTokens(access_token, refresh_token);

          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          await deleteTokens();
          // Redirect to login screen after token refresh failure
          console.log('Token refresh failed. Logging out...');
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
