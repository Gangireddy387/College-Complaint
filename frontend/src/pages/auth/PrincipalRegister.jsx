import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { principalService } from '../../services/principal.service';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Container,
  Link,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Email,
  Lock,
  Person,
  Phone,
  Work,
  ArrowBack,
} from '@mui/icons-material';

const PrincipalRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    joining_date: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_id) {
      errors.employee_id = 'Employee ID is required';
    } else if (formData.employee_id.length < 3) {
      errors.employee_id = 'Employee ID must be at least 3 characters';
    }
    
    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone_number) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      errors.phone_number = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.joining_date) {
      errors.joining_date = 'Joining date is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await principalService.register(registrationData);
      setSuccess('Registration successful! Your account is pending verification. You will be able to login once verified by administrator.');
      
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(233, 69, 96, 0.2)',
            '&:hover': {
              boxShadow: '0 20px 40px rgba(233, 69, 96, 0.3)',
              transform: 'translateY(-5px)',
              transition: 'all 0.3s ease',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
              color: 'white',
              textAlign: 'center',
              padding: 4,
            }}
          >
            <School sx={{ 
              fontSize: 60, 
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }} />
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              College Management System
            </Typography>
            <Typography 
              variant="h6" 
              component="h2"
              sx={{
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Principal Registration
            </Typography>
          </Box>

          {/* Registration Form */}
          <CardContent sx={{ padding: 4 }}>
            {/* Back to Login */}
            <Box sx={{ mb: 3 }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleBackToLogin}
                sx={{
                  color: '#e94560',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#f39c12',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ArrowBack sx={{ mr: 1, fontSize: 20 }} />
                Back to Login
              </Link>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Employee ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    error={!!validationErrors.employee_id}
                    helperText={validationErrors.employee_id}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work sx={{ color: '#e94560' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Joining Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Joining Date"
                    name="joining_date"
                    type="date"
                    value={formData.joining_date}
                    onChange={handleInputChange}
                    error={!!validationErrors.joining_date}
                    helperText={validationErrors.joining_date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    error={!!validationErrors.first_name}
                    helperText={validationErrors.first_name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#e94560' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    error={!!validationErrors.last_name}
                    helperText={validationErrors.last_name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#e94560' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#e94560' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    error={!!validationErrors.phone_number}
                    helperText={validationErrors.phone_number}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: '#e94560' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#e94560' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            sx={{
                              color: '#e94560',
                              '&:hover': {
                                backgroundColor: 'rgba(233, 69, 96, 0.1)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!validationErrors.confirmPassword}
                    helperText={validationErrors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#e94560' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                            sx={{
                              color: '#e94560',
                              '&:hover': {
                                backgroundColor: 'rgba(233, 69, 96, 0.1)',
                              },
                            }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#e94560',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e94560',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mt: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(233, 69, 96, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(233, 69, 96, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ opacity: 0.8 }}
              >
                Already have an account?
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={handleBackToLogin}
                sx={{
                  color: '#e94560',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#f39c12',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign In Here
              </Link>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrincipalRegister;
