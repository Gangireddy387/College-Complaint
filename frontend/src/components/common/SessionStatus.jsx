import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Alert } from '@mui/material';
import { getTokenExpirationTime } from '../../utils/sessionUtils';

const SessionStatus = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!token) return;

    const updateTimeUntilExpiration = () => {
      const expirationTime = getTokenExpirationTime(token);
      if (!expirationTime) return;

      const timeLeft = expirationTime - Date.now();
      setTimeUntilExpiration(timeLeft);

      // Show warning when less than 5 minutes remaining
      if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    updateTimeUntilExpiration();
    const interval = setInterval(updateTimeUntilExpiration, 1000);

    return () => clearInterval(interval);
  }, [token]);

  if (!token || !user) return null;

  const formatTime = (ms) => {
    if (ms <= 0) return 'Expired';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1000 }}>
      {showWarning && (
        <Alert 
          severity="warning" 
          sx={{ mb: 1, minWidth: 300 }}
        >
          <Typography variant="body2">
            Session expires in {formatTime(timeUntilExpiration)}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default SessionStatus;
