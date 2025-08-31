import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

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

  // Registration
  register: async (registrationData) => {
    return api.post('/principal/register', registrationData);
  },

  // Forgot Password
  sendOTP: async (email) => {
    return api.post('/principal/forgot-password', { email });
  },

  verifyOTP: async (email, otp) => {
    return api.post('/principal/verify-otp', { email, otp });
  },

  resetPassword: async (email, otp, newPassword) => {
    return api.post('/principal/reset-password', { email, otp, newPassword });
  },

  // Admin methods for verification
  getAllPrincipals: async () => {
    return api.get('/principal/all');
  },

  verifyPrincipal: async (principalId) => {
    return api.put(`/principal/verify/${principalId}`);
  },

  // College Profile Methods
  getCollegeProfile: async () => {
    return api.get('/college/profile');
  },

  createCollege: async (collegeData) => {
    return api.post('/college', collegeData);
  },

  updateCollegeProfile: async (collegeData) => {
    return api.put('/college/profile', collegeData);
  },
};
