import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getPrincipalProfile } from '../../store/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getPrincipalProfile());
    }
  }, [dispatch, token, user]);

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
