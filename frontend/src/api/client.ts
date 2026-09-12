import axios from 'axios';
import { supabase } from '../lib/supabase';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Automatically attach the Supabase JWT token to every request
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only redirect to login if we get a 401 on an already authenticated protected route,
    // not during initial profile fetch on the login page itself.
    if (error.response?.status === 401) {
      const isAuthRoute = window.location.pathname === '/' ||
        window.location.pathname === '/admin/login' ||
        window.location.pathname === '/forgot-password';

      const isProfileCheck = error.config?.url?.includes('/auth/profile');

      if (!isAuthRoute && !isProfileCheck) {
        await supabase.auth.signOut();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
