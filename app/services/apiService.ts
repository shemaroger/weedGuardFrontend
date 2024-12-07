import axios from 'axios';
import { saveTokens, getTokens, deleteTokens } from './TokenManager';

const API_BASE_URL = 'http://192.168.3.116:8000/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    if (tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      const tokens = await getTokens();
      if (tokens?.refreshToken) {
        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}/refresh-token`, {
            refresh_token: tokens.refreshToken,
          });
          const { access_token, refresh_token } = refreshResponse.data;
          await saveTokens(access_token, refresh_token);
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (err) {
          await deleteTokens();
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
