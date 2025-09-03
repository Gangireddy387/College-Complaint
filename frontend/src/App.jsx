import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { theme } from './theme';
import { setupSessionCheck } from './utils/sessionUtils';
import PrincipalLogin from './pages/auth/PrincipalLogin';
import PrincipalRegister from './pages/auth/PrincipalRegister';
import PrincipalForgotPassword from './pages/auth/PrincipalForgotPassword';
import PrincipalDashboard from './pages/principal/Dashboard';
import PrincipalProfile from './pages/principal/PrincipalProfile';
import CollegeProfile from './pages/principal/CollegeProfile';
import SessionStatus from './components/common/SessionStatus';

import Departments from './pages/principal/Departments';
import Faculties from './pages/principal/Faculties';
import Students from './pages/principal/Students';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  useEffect(() => {
    // Set up session expiration checking
    setupSessionCheck();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <SessionStatus />
          <Routes>
            <Route path="/login" element={<PrincipalLogin />} />
            <Route path="/register" element={<PrincipalRegister />} />
            <Route path="/forgot-password" element={<PrincipalForgotPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><PrincipalDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PrincipalProfile /></ProtectedRoute>} />
            <Route path="/college-profile" element={<ProtectedRoute><CollegeProfile /></ProtectedRoute>} />

            <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
            <Route path="/faculties" element={<ProtectedRoute><Faculties /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
