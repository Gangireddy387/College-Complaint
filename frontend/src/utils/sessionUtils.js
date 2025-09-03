import { jwtDecode } from 'jwt-decode';

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Get token expiration time
export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if session is valid
export const isSessionValid = () => {
  const token = localStorage.getItem('principalToken');
  if (!token) return false;
  
  return !isTokenExpired(token);
};

// Clear session data
export const clearSession = () => {
  localStorage.removeItem('principalToken');
  // Clear any other session-related data
  sessionStorage.clear();
};

// Redirect to login
export const redirectToLogin = () => {
  clearSession();
  window.location.href = '/login';
};

// Set up session expiration check
export const setupSessionCheck = () => {
  const token = localStorage.getItem('principalToken');
  if (!token) return;

  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return;

  const timeUntilExpiration = expirationTime - Date.now();
  
  // If token is already expired, redirect immediately
  if (timeUntilExpiration <= 0) {
    redirectToLogin();
    return;
  }

  // Set timeout to redirect when token expires
  setTimeout(() => {
    console.log('Session expired, redirecting to login...');
    redirectToLogin();
  }, timeUntilExpiration);

  // Also check every minute for expired tokens
  setInterval(() => {
    if (isTokenExpired(token)) {
      console.log('Session expired (interval check), redirecting to login...');
      redirectToLogin();
    }
  }, 60000); // Check every minute
};
