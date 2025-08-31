import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { theme } from './theme';
import PrincipalLogin from './pages/auth/PrincipalLogin';
import PrincipalDashboard from './pages/principal/Dashboard';
import PrincipalProfile from './pages/principal/PrincipalProfile';

import Departments from './pages/principal/Departments';
import Faculties from './pages/principal/Faculties';
import Students from './pages/principal/Students';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<PrincipalLogin />} />
            <Route path="/dashboard" element={<PrincipalDashboard />} />
            <Route path="/profile" element={<PrincipalProfile />} />

            <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
            <Route path="/faculties" element={<ProtectedRoute><Faculties /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
