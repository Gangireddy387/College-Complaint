import axios from 'axios';
import { isTokenExpired, redirectToLogin } from '../utils/sessionUtils';

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
    
    // Check if token is expired before making request
    if (token && isTokenExpired(token)) {
      console.log('Token expired, redirecting to login...');
      redirectToLogin();
      return Promise.reject(new Error('Token expired'));
    }
    
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
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      console.log('Session expired, redirecting to login...');
      redirectToLogin();
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

  // Department Methods
  getDepartments: async () => {
    return api.get('/department');
  },

  getDepartment: async (id) => {
    return api.get(`/department/${id}`);
  },

  createDepartment: async (departmentData) => {
    return api.post('/department', departmentData);
  },

  updateDepartment: async (id, departmentData) => {
    return api.put(`/department/${id}`, departmentData);
  },

  deleteDepartment: async (id) => {
    return api.delete(`/department/${id}`);
  },

  getAvailableFaculty: async () => {
    return api.get('/department/faculty/available');
  },

  // Faculty Methods
  getFaculty: async () => {
    return api.get('/faculty');
  },

  getFacultyMember: async (id) => {
    return api.get(`/faculty/${id}`);
  },

  createFaculty: async (facultyData) => {
    return api.post('/faculty', facultyData);
  },

  updateFaculty: async (id, facultyData) => {
    return api.put(`/faculty/${id}`, facultyData);
  },

  deleteFaculty: async (id) => {
    return api.delete(`/faculty/${id}`);
  },

  getAvailableDepartments: async () => {
    return api.get('/faculty/departments/available');
  },
};
