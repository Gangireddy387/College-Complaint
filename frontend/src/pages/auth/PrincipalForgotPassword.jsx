import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { principalService } from '../../services/principal.service';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  Link,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School,
  Email,
  Lock,
  Security,
  ArrowBack,
} from '@mui/icons-material';

const PrincipalForgotPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear any existing error/success messages
    setError('');
    setSuccess('');
  };

  const validateEmail = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOTP = () => {
    const errors = {};
    if (!formData.otp) {
      errors.otp = 'OTP is required';
    } else if (!/^\d{4}$/.test(formData.otp)) {
      errors.otp = 'Please enter a valid 4-digit OTP';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await principalService.sendOTP(formData.email);
      setSuccess('OTP sent successfully to your email!');
      setActiveStep(1);
    } catch (error) {
      setError(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await principalService.verifyOTP(formData.email, formData.otp);
      setSuccess('OTP verified successfully!');
      setActiveStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await principalService.resetPassword(formData.email, formData.otp, formData.newPassword);
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              gutterBottom 
              sx={{ 
                mb: isMobile ? 2 : 3, 
                color: '#e94560', 
                fontWeight: 'bold',
                fontSize: isMobile ? '1.1rem' : undefined,
              }}
            >
              Enter Your Email Address
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: isMobile ? 2 : 3, 
                opacity: 0.8,
                fontSize: isMobile ? '0.875rem' : undefined,
              }}
            >
              We'll send a 4-digit OTP to your registered email address to verify your identity.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <Email sx={{ color: '#e94560', mr: 1, fontSize: isMobile ? 20 : 24 }} />
                ),
              }}
              sx={{ 
                mb: isMobile ? 2 : 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#e94560',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e94560',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={handleSendOTP}
              disabled={isLoading}
              sx={{
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                  transform: isMobile ? 'translateY(-1px)' : 'translateY(-2px)',
                  boxShadow: isMobile ? '0 4px 8px rgba(233, 69, 96, 0.4)' : '0 8px 16px rgba(233, 69, 96, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(233, 69, 96, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              gutterBottom 
              sx={{ 
                mb: isMobile ? 2 : 3, 
                color: '#e94560', 
                fontWeight: 'bold',
                fontSize: isMobile ? '1.1rem' : undefined,
              }}
            >
              Enter 4-Digit OTP
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: isMobile ? 2 : 3, 
                opacity: 0.8,
                fontSize: isMobile ? '0.875rem' : undefined,
              }}
            >
              We've sent a 4-digit OTP to {formData.email}. Please enter it below.
            </Typography>
            <TextField
              fullWidth
              label="OTP Code"
              name="otp"
              type="text"
              value={formData.otp}
              onChange={handleInputChange}
              error={!!validationErrors.otp}
              helperText={validationErrors.otp}
              margin="normal"
              size={isMobile ? "small" : "medium"}
              inputProps={{ maxLength: 4 }}
              InputProps={{
                startAdornment: (
                  <Security sx={{ color: '#e94560', mr: 1, fontSize: isMobile ? 20 : 24 }} />
                ),
              }}
              sx={{ 
                mb: isMobile ? 2 : 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#e94560',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e94560',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={handleVerifyOTP}
              disabled={isLoading}
              sx={{
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                  transform: isMobile ? 'translateY(-1px)' : 'translateY(-2px)',
                  boxShadow: isMobile ? '0 4px 8px rgba(233, 69, 96, 0.4)' : '0 8px 16px rgba(233, 69, 96, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(233, 69, 96, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              gutterBottom 
              sx={{ 
                mb: isMobile ? 2 : 3, 
                color: '#e94560', 
                fontWeight: 'bold',
                fontSize: isMobile ? '1.1rem' : undefined,
              }}
            >
              Set New Password
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: isMobile ? 2 : 3, 
                opacity: 0.8,
                fontSize: isMobile ? '0.875rem' : undefined,
              }}
            >
              Please enter your new password. Make sure it's secure and easy to remember.
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={!!validationErrors.newPassword}
              helperText={validationErrors.newPassword}
              margin="normal"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <Lock sx={{ color: '#e94560', mr: 1, fontSize: isMobile ? 20 : 24 }} />
                ),
              }}
              sx={{ 
                mb: isMobile ? 1.5 : 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#e94560',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e94560',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              margin="normal"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <Lock sx={{ color: '#e94560', mr: 1, fontSize: isMobile ? 20 : 24 }} />
                ),
              }}
              sx={{ 
                mb: isMobile ? 2 : 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#e94560',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e94560',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={handleResetPassword}
              disabled={isLoading}
              sx={{
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                  transform: isMobile ? 'translateY(-1px)' : 'translateY(-2px)',
                  boxShadow: isMobile ? '0 4px 8px rgba(233, 69, 96, 0.4)' : '0 8px 16px rgba(233, 69, 96, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(233, 69, 96, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 1 : 2,
      }}
    >
      <Container maxWidth={isMobile ? false : "sm"} sx={{ px: isMobile ? 1 : 2 }}>
        <Paper
          elevation={24}
          sx={{
            borderRadius: isMobile ? 2 : 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(233, 69, 96, 0.2)',
            '&:hover': {
              boxShadow: isMobile ? '0 10px 20px rgba(233, 69, 96, 0.3)' : '0 20px 40px rgba(233, 69, 96, 0.3)',
              transform: isMobile ? 'translateY(-2px)' : 'translateY(-5px)',
              transition: 'all 0.3s ease',
            },
            transition: 'all 0.3s ease',
            width: '100%',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
              color: 'white',
              textAlign: 'center',
              padding: isMobile ? 2 : 4,
            }}
          >
            <School sx={{ 
              fontSize: isMobile ? 40 : 60, 
              mb: isMobile ? 1 : 2,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }} />
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: isMobile ? '1.5rem' : undefined,
              }}
            >
              Forgot Password
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"}
              component="h2"
              sx={{
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontSize: isMobile ? '0.9rem' : undefined,
              }}
            >
              Reset Your Principal Account Password
            </Typography>
          </Box>

          {/* Content */}
          <CardContent sx={{ padding: isMobile ? 2 : 4 }}>
            {/* Back to Login */}
            <Box sx={{ mb: isMobile ? 2 : 3 }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleBackToLogin}
                sx={{
                  color: '#e94560',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: isMobile ? '0.875rem' : undefined,
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#f39c12',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ArrowBack sx={{ mr: 1, fontSize: isMobile ? 16 : 20 }} />
                Back to Login
              </Link>
            </Box>

            {/* Stepper */}
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: isMobile ? 2 : 4,
                '& .MuiStepLabel-label': {
                  fontSize: isMobile ? '0.75rem' : undefined,
                },
                '& .MuiStepLabel-iconContainer': {
                  paddingRight: isMobile ? 1 : 2,
                },
              }}
              orientation={isMobile ? "vertical" : "horizontal"}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: isMobile ? 2 : 3, fontSize: isMobile ? '0.875rem' : undefined }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: isMobile ? 2 : 3, fontSize: isMobile ? '0.875rem' : undefined }}>
                {success}
              </Alert>
            )}

            {/* Step Content */}
            {renderStepContent(activeStep)}
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrincipalForgotPassword;
