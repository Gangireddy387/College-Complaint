import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('principalToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('principalToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const principalService = {
  // Authentication
  login: async (credentials) => {
    return api.post('/principal/login', credentials);
  },

  logout: async () => {
    return api.post('/principal/logout');
  },

  // Profile Management
  getProfile: async () => {
    return api.get('/principal/profile');
  },

  updateProfile: async (profileData) => {
    return api.put('/principal/profile', profileData);
  },

  changePassword: async (passwordData) => {
    return api.put('/principal/change-password', passwordData);
  },

  // Dashboard Data
  getDashboardStats: async () => {
    return api.get('/principal/dashboard/stats');
  },

  getRecentComplaints: async () => {
    return api.get('/principal/dashboard/recent-complaints');
  },

  getDepartmentStats: async () => {
    return api.get('/principal/dashboard/department-stats');
  },
};
