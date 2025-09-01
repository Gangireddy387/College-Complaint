import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import { Save, Edit, School } from '@mui/icons-material';
import { getCollegeProfile, createCollege, updateCollegeProfile } from '../../store/slices/collegeSlice';
import MainLayout from '../../layouts/MainLayout';

const CollegeProfile = () => {
  const dispatch = useDispatch();
  const { college, isLoading, error } = useSelector((state) => state.college);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'private',
    address: '',
    phone: '',
    email: '',
    website: '',
    establishment_date: '',
    facilities: [],
    departments: [],
    achievements: [],
    status: 'active'
  });

  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load existing college data
  useEffect(() => {
    dispatch(getCollegeProfile());
  }, [dispatch]);

  // Update form data when college data changes
  useEffect(() => {
    if (college) {
      setFormData({
        name: college.name || '',
        code: college.code || '',
        type: college.type || 'private',
        address: college.address || '',
        phone: college.phone || '',
        email: college.email || '',
        website: college.website || '',
        establishment_date: college.establishment_date || '',
        facilities: college.facilities || [],
        departments: college.departments || [],
        achievements: college.achievements || [],
        status: college.status || 'active'
      });
    }
  }, [college]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.code || !formData.address || !formData.phone || !formData.email || !formData.establishment_date) {
      setSuccess('');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setSuccess('');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSuccess('');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSuccess('');

    try {
      await dispatch(updateCollegeProfile(formData)).unwrap();
      setSuccess('College profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update college profile:', error);
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSuccess('');

    try {
      await dispatch(createCollege(formData)).unwrap();
      setSuccess('College created successfully! Your account has been linked to this college.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to create college:', error);
    }
  };

  if (isLoading && !college) {
    return (
      <MainLayout>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
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
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            College Profile
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Manage your college information and settings
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
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
                  <School 
                    sx={{ 
                      mr: { xs: 0, sm: 2 }, 
                      mb: { xs: 2, sm: 0 },
                      background: 'linear-gradient(45deg, #e94560, #f39c12)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    component="h2"
                    sx={{
                      background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold',
                      textAlign: { xs: 'center', sm: 'left' },
                    }}
                  >
                    College Information
                  </Typography>
                </Box>

                {college ? (
                  // Display existing college data
                  <Paper 
                    sx={{ 
                      p: 3, 
                      mb: 3,
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      border: '1px solid rgba(233, 69, 96, 0.1)',
                    }}
                  >
                    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'center', sm: 'flex-start' }} mb={2} gap={2}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e94560', textAlign: { xs: 'center', sm: 'left' } }}>
                        Current College Details
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setIsEditing(true)}
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
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Name</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{college.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Code</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{college.code}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Type</Typography>
                        <Chip 
                          label={college.type} 
                          color="primary" 
                          sx={{ 
                            mb: 2,
                            background: 'linear-gradient(45deg, #e94560, #f39c12)',
                            color: 'white',
                            fontWeight: 'bold',
                          }} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Status</Typography>
                        <Chip 
                          label={college.status} 
                          color={college.status === 'active' ? 'success' : 'default'} 
                          sx={{ 
                            mb: 2,
                            fontWeight: 'bold',
                          }} 
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Address</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{college.address}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Phone</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{college.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Email</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{college.email}</Typography>
                      </Grid>
                      {college.website && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Website</Typography>
                          <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{college.website}</Typography>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Establishment Date</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>
                          {new Date(college.establishment_date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    {college.facilities && college.facilities.length > 0 && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(233, 69, 96, 0.2)' }} />
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>Facilities</Typography>
                        <Box sx={{ mb: 2 }}>
                          {college.facilities.map((facility, index) => (
                            <Chip 
                              key={index} 
                              label={facility} 
                              sx={{ 
                                mr: 1, 
                                mb: 1,
                                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                                color: 'white',
                                fontWeight: 'bold',
                              }} 
                            />
                          ))}
                        </Box>
                      </>
                    )}

                    {college.departments && college.departments.length > 0 && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(233, 69, 96, 0.2)' }} />
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>Departments</Typography>
                        <Box sx={{ mb: 2 }}>
                          {college.departments.map((dept, index) => (
                            <Chip 
                              key={index} 
                              label={dept} 
                              color="secondary" 
                              sx={{ 
                                mr: 1, 
                                mb: 1,
                                fontWeight: 'bold',
                              }} 
                            />
                          ))}
                        </Box>
                      </>
                    )}

                    {college.achievements && college.achievements.length > 0 && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(233, 69, 96, 0.2)' }} />
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>Achievements</Typography>
                        <Box sx={{ mb: 2 }}>
                          {college.achievements.map((achievement, index) => (
                            <Chip 
                              key={index} 
                              label={achievement} 
                              color="success" 
                              sx={{ 
                                mr: 1, 
                                mb: 1,
                                fontWeight: 'bold',
                              }} 
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                ) : null}

                {(isEditing || !college) && (
                  <Paper 
                    sx={{ 
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      border: '1px solid rgba(233, 69, 96, 0.1)',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#e94560' }}>
                      {college ? 'Edit College Information' : 'Create New College'}
                    </Typography>
                    
                    <Box component="form" onSubmit={college ? handleSubmit : handleCreateCollege}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="College Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
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
                            label="College Code *"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            required
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
                          <FormControl fullWidth>
                            <InputLabel>Type *</InputLabel>
                            <Select
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              label="Type *"
                              sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                  '&:hover': {
                                    borderColor: '#e94560',
                                  },
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#e94560',
                                },
                              }}
                            >
                              <MenuItem value="government">Government</MenuItem>
                              <MenuItem value="private">Private</MenuItem>
                              <MenuItem value="autonomous">Autonomous</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              label="Status"
                              sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                  '&:hover': {
                                    borderColor: '#e94560',
                                  },
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#e94560',
                                },
                              }}
                            >
                              <MenuItem value="active">Active</MenuItem>
                              <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address *"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            required
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
                            label="Phone Number *"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            helperText="10 digits only"
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
                            label="Email *"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
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
                            label="Website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
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
                            label="Establishment Date *"
                            name="establishment_date"
                            type="date"
                            value={formData.establishment_date}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            required
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
                            label="Facilities (comma-separated)"
                            value={formData.facilities.join(', ')}
                            onChange={(e) => handleArrayInputChange('facilities', e.target.value)}
                            helperText="Enter facilities separated by commas"
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
                            label="Departments (comma-separated)"
                            value={formData.departments.join(', ')}
                            onChange={(e) => handleArrayInputChange('departments', e.target.value)}
                            helperText="Enter departments separated by commas"
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
                            label="Achievements (comma-separated)"
                            value={formData.achievements.join(', ')}
                            onChange={(e) => handleArrayInputChange('achievements', e.target.value)}
                            helperText="Enter achievements separated by commas"
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
                          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<Save />}
                              disabled={isLoading}
                              sx={{
                                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #f39c12, #e94560)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(233, 69, 96, 0.3)',
                                },
                                '&:disabled': {
                                  background: 'rgba(233, 69, 96, 0.3)',
                                },
                              }}
                            >
                              {isLoading ? <CircularProgress size={20} /> : (college ? 'Update Profile' : 'Create College')}
                            </Button>
                            {isEditing && (
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setIsEditing(false);
                                  // Reset form data to current college data
                                  if (college) {
                                    setFormData({
                                      name: college.name || '',
                                      code: college.code || '',
                                      type: college.type || 'private',
                                      address: college.address || '',
                                      phone: college.phone || '',
                                      email: college.email || '',
                                      website: college.website || '',
                                      establishment_date: college.establishment_date || '',
                                      facilities: college.facilities || [],
                                      departments: college.departments || [],
                                      achievements: college.achievements || [],
                                      status: college.status || 'active'
                                    });
                                  }
                                }}
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
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
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
                  College Quick Actions
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
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
                    Edit College Profile
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<School />}
                    onClick={() => window.history.back()}
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
                  College Profile Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: college ? 'success.main' : 'warning.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">
                    {college ? 'Profile Complete' : 'Profile Pending'}
                  </Typography>
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
                  <Typography variant="body2">College Active</Typography>
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
                  <Typography variant="body2">Management Ready</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default CollegeProfile;
