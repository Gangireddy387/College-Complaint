import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { getPrincipalProfile } from '../../store/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getPrincipalProfile());
    }
  }, [dispatch, token, user]);

  // Check if token exists but user is not authenticated
  useEffect(() => {
    const checkTokenValidity = () => {
      const storedToken = localStorage.getItem('principalToken');
      if (storedToken && !isAuthenticated && !isLoading) {
        console.log('Token exists but user not authenticated, redirecting to login...');
        localStorage.removeItem('principalToken');
        navigate('/login', { replace: true });
      }
    };

    checkTokenValidity();
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
