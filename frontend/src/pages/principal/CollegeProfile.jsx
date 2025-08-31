import React, { useState, useEffect } from 'react';
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
import { principalService } from '../../services/principal.service';
import MainLayout from '../../layouts/MainLayout';

const CollegeProfile = () => {
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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [collegeData, setCollegeData] = useState(null);

  // Load existing college data
  useEffect(() => {
    loadCollegeData();
  }, []);

  const loadCollegeData = async () => {
    try {
      setLoading(true);
      const response = await principalService.getCollegeProfile();
      if (response.data) {
        setCollegeData(response.data);
        setFormData({
          name: response.data.name || '',
          code: response.data.code || '',
          type: response.data.type || 'private',
          address: response.data.address || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          website: response.data.website || '',
          establishment_date: response.data.establishment_date || '',
          facilities: response.data.facilities || [],
          departments: response.data.departments || [],
          achievements: response.data.achievements || [],
          status: response.data.status || 'active'
        });
      }
    } catch (error) {
      console.log('No existing college data found');
    } finally {
      setLoading(false);
    }
  };

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
      setError('Please fill in all required fields');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await principalService.updateCollegeProfile(formData);
      setSuccess('College profile updated successfully!');
      setCollegeData(response.data.college);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update college profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await principalService.createCollege(formData);
      setSuccess('College created successfully! Your account has been linked to this college.');
      setCollegeData(response.data.college);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create college');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !collegeData) {
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
          <Grid item xs={12}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <School 
                    sx={{ 
                      mr: 2, 
                      background: 'linear-gradient(45deg, #e94560, #f39c12)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '2rem',
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
                    }}
                  >
                    College Information
                  </Typography>
                </Box>

                {collegeData ? (
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
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e94560' }}>
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
                          },
                        }}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Name</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{collegeData.name}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Code</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{collegeData.code}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Type</Typography>
                        <Chip 
                          label={collegeData.type} 
                          color="primary" 
                          sx={{ 
                            mb: 2,
                            background: 'linear-gradient(45deg, #e94560, #f39c12)',
                            color: 'white',
                            fontWeight: 'bold',
                          }} 
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Status</Typography>
                        <Chip 
                          label={collegeData.status} 
                          color={collegeData.status === 'active' ? 'success' : 'default'} 
                          sx={{ 
                            mb: 2,
                            fontWeight: 'bold',
                          }} 
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Address</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{collegeData.address}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Phone</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{collegeData.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Email</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{collegeData.email}</Typography>
                      </Grid>
                      {collegeData.website && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Website</Typography>
                          <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>{collegeData.website}</Typography>
                        </Grid>
                      )}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Establishment Date</Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#e94560' }}>
                          {new Date(collegeData.establishment_date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    {collegeData.facilities && collegeData.facilities.length > 0 && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(233, 69, 96, 0.2)' }} />
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>Facilities</Typography>
                        <Box sx={{ mb: 2 }}>
                          {collegeData.facilities.map((facility, index) => (
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

                    {collegeData.departments && collegeData.departments.length > 0 && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(233, 69, 96, 0.2)' }} />
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>Departments</Typography>
                        <Box sx={{ mb: 2 }}>
                          {collegeData.departments.map((dept, index) => (
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

                    {collegeData.achievements && collegeData.achievements.length > 0 && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(233, 69, 96, 0.2)' }} />
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>Achievements</Typography>
                        <Box sx={{ mb: 2 }}>
                          {collegeData.achievements.map((achievement, index) => (
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

                {(isEditing || !collegeData) && (
                  <Paper 
                    sx={{ 
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      border: '1px solid rgba(233, 69, 96, 0.1)',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#e94560' }}>
                      {collegeData ? 'Edit College Information' : 'Create New College'}
                    </Typography>
                    
                    <Box component="form" onSubmit={collegeData ? handleSubmit : handleCreateCollege}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={6}>
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
                          <Box display="flex" gap={2}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<Save />}
                              disabled={loading}
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
                              {loading ? <CircularProgress size={20} /> : (collegeData ? 'Update Profile' : 'Create College')}
                            </Button>
                            {isEditing && (
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setIsEditing(false);
                                  loadCollegeData();
                                }}
                                sx={{
                                  borderColor: '#e94560',
                                  color: '#e94560',
                                  '&:hover': {
                                    borderColor: '#f39c12',
                                    backgroundColor: 'rgba(233, 69, 96, 0.1)',
                                  },
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
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default CollegeProfile;
