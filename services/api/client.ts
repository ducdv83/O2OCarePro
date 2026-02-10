import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '../../store/auth.store';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://o2o-backend-gateway.o2ocare-sys.workers.dev/api/v1';

console.log('[API] Base URL:', API_BASE_URL);

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = config.method?.toUpperCase();
    const url = config.url || '';
    const baseURL = config.baseURL || '';
    const fullUrl = baseURL ? `${baseURL}${url}` : url;
    const data = config.data ?? null;
    console.log('[API] Request', { method, url, fullUrl, data });

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = (error.config as any)?.url;
    console.log('[API] Error', { status, url, message: error.message });
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      useAuthStore.getState().logout();
      // Navigation will be handled by RootLayoutNav
    }

    // Transform error response
    const errorMessage =
      (error.response?.data as any)?.message ||
      error.message ||
      'Có lỗi xảy ra. Vui lòng thử lại.';

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

export default apiClient;
