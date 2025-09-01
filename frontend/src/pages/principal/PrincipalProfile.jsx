import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPrincipalProfile } from '../../store/slices/authSlice';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Divider,
  TextField,
  Alert,
  Paper,
  Chip,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  CalendarToday,
  School,
  Save,
  Cancel,
  NavigateNext,
} from '@mui/icons-material';
import { updatePrincipalProfile } from '../../store/slices/authSlice';
import MainLayout from '../../layouts/MainLayout';

const PrincipalProfile = () => {
  console.log('PrincipalProfile component loaded');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Fetch latest profile data when component mounts
    dispatch(getPrincipalProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setEditMode(true);
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
    });
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!profileData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!profileData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (profileData.phone_number && !/^[0-9]{10}$/.test(profileData.phone_number)) {
      errors.phone_number = 'Please enter a valid 10-digit phone number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(updatePrincipalProfile(profileData)).unwrap();
      // Fetch updated profile data immediately after successful update
      await dispatch(getPrincipalProfile());
      setEditMode(false);
      setValidationErrors({});
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link 
              underline="hover" 
              color="inherit" 
              href="/dashboard"
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
            >
              Dashboard
            </Link>
            <Typography color="text.primary">Profile</Typography>
          </Breadcrumbs>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Principal Profile Settings
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Manage your personal information and account details as Principal
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} lg={8}>
            <Card 
              elevation={3}
              sx={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%)',
                border: '1px solid rgba(233, 69, 96, 0.2)',
                borderRadius: 3,
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(233, 69, 96, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      background: 'linear-gradient(45deg, #e94560, #f39c12)',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      mr: { xs: 0, sm: 3 },
                      mb: { xs: 2, sm: 0 },
                      boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    {user?.first_name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      gutterBottom
                      sx={{
                        background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                      }}
                    >
                      {user?.first_name} {user?.last_name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }} gutterBottom>
                      Principal - College Management System
                    </Typography>
                    <Chip
                      label="Principal"
                      size="medium"
                      sx={{ 
                        mr: 1,
                        background: 'linear-gradient(45deg, #e94560, #f39c12)',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    />
                    <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8, mt: 1 }}>
                      Employee ID: {user?.employee_id || 'Not available'}
                    </Typography>
                  </Box>
                  {!editMode && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEditProfile}
                      size="large"
                      sx={{
                        borderColor: '#e94560',
                        color: '#e94560',
                        mt: { xs: 2, sm: 0 },
                        '&:hover': {
                          borderColor: '#f39c12',
                          backgroundColor: 'rgba(233, 69, 96, 0.1)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>

                <Divider sx={{ mb: 4 }} />

                {editMode ? (
                  <Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                      }}
                    >
                      Principal Personal Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="first_name"
                          value={profileData.first_name}
                          onChange={handleInputChange}
                          error={!!validationErrors.first_name}
                          helperText={validationErrors.first_name}
                          margin="normal"
                          placeholder="Enter your first name"
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          value={profileData.last_name}
                          onChange={handleInputChange}
                          error={!!validationErrors.last_name}
                          helperText={validationErrors.last_name}
                          margin="normal"
                          placeholder="Enter your last name"
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
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          error={!!validationErrors.email}
                          helperText={validationErrors.email}
                          margin="normal"
                          placeholder="Enter your email address"
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
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone_number"
                          value={profileData.phone_number}
                          onChange={handleInputChange}
                          error={!!validationErrors.phone_number}
                          helperText={validationErrors.phone_number}
                          margin="normal"
                          placeholder="Enter 10-digit phone number"
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
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        size="large"
                        sx={{
                          background: 'linear-gradient(45deg, #e94560, #f39c12)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #f39c12, #e94560)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                        size="large"
                        disabled={isLoading}
                        sx={{
                          borderColor: '#e94560',
                          color: '#e94560',
                          '&:hover': {
                            borderColor: '#f39c12',
                            backgroundColor: 'rgba(233, 69, 96, 0.1)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                      }}
                    >
                      Principal Contact Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper 
                          sx={{ 
                            p: 3, 
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%)',
                            border: '1px solid rgba(233, 69, 96, 0.2)',
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(233, 69, 96, 0.2)',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Email 
                              sx={{ 
                                mr: 2, 
                                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }} 
                            />
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                              Email Address
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {user?.email || 'Email not available'}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper 
                          sx={{ 
                            p: 3, 
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%)',
                            border: '1px solid rgba(233, 69, 96, 0.2)',
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(233, 69, 96, 0.2)',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Phone 
                              sx={{ 
                                mr: 2, 
                                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }} 
                            />
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                              Phone Number
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {user?.phone_number || 'Phone number not available'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        mt: 4, 
                        mb: 3,
                        background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                      }}
                    >
                      Principal Account Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper 
                          sx={{ 
                            p: 3, 
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%)',
                            border: '1px solid rgba(233, 69, 96, 0.2)',
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(233, 69, 96, 0.2)',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CalendarToday 
                              sx={{ 
                                mr: 2, 
                                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }} 
                            />
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                              Joining Date
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {formatDate(user?.joining_date)}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper 
                          sx={{ 
                            p: 3, 
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%)',
                            border: '1px solid rgba(233, 69, 96, 0.2)',
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(233, 69, 96, 0.2)',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <School 
                              sx={{ 
                                mr: 2, 
                                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }} 
                            />
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                              Employee ID
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {user?.employee_id || 'Not available'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Info */}
          <Grid item xs={12} lg={4}>
            <Card 
              elevation={3}
              sx={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%)',
                border: '1px solid rgba(233, 69, 96, 0.2)',
                borderRadius: 3,
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(233, 69, 96, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                  }}
                >
                  Principal Quick Actions
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Edit />}
                    onClick={handleEditProfile}
                    disabled={editMode}
                    sx={{
                      borderColor: '#e94560',
                      color: '#e94560',
                      '&:hover': {
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(233, 69, 96, 0.1)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Edit Profile
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<School />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      borderColor: '#e94560',
                      color: '#e94560',
                      '&:hover': {
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(233, 69, 96, 0.1)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Back to Dashboard
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Principal Profile Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">Profile Complete</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">Email Verified</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">Account Active</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default PrincipalProfile;
