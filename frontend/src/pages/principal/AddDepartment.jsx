import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';

export const AddDepartment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    department_code: '',
    name: '',
    description: '',
    established_year: '',
    email: '',
    phone_number: '',
    building: '',
    floor: '',
    room: '',
    campus: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  const { user } = useSelector((state) => state.auth);

  const validateForm = () => {
    const errors = {};
    if (!formData.department_code) errors.department_code = 'Department code is required';
    if (!formData.name) errors.name = 'Department name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.established_year) errors.established_year = 'Established year is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone_number) errors.phone_number = 'Phone number is required';
    if (!formData.building) errors.building = 'Building is required';
    if (!formData.floor) errors.floor = 'Floor is required';
    if (!formData.room) errors.room = 'Room is required';
    if (!formData.campus) errors.campus = 'Campus is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const departmentData = {
        ...formData,
        location: {
          building: formData.building,
          floor: formData.floor,
          room: formData.room,
          campus: formData.campus
        },
        facilities: [],
        programs: [],
        research_areas: [],
        total_students: 0,
        total_faculty: 0,
        budget: 0
      };

      // Create new department
      const newItem = { 
        ...departmentData, 
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      // Here you would typically make an API call to save the department
      console.log('Creating new department:', newItem);
      
      setSuccessMessage('Department created successfully');
      
      // Redirect back to departments list after a short delay
      setTimeout(() => {
        navigate('/principal/departments');
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCancel = () => {
    navigate('/principal/departments');
  };

  return (
    <Box>
      <PageHeader
        title="Add New Department"
        subtitle="Create a new academic department"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Management', path: '/principal/management' },
          { label: 'Departments', path: '/principal/departments' },
          { label: 'Add Department', path: '/principal/departments/add' },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={handleCloseError}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Department Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details below to create a new department
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Code"
                value={formData.department_code}
                onChange={(e) => handleInputChange('department_code', e.target.value)}
                error={!!formErrors.department_code}
                helperText={formErrors.department_code}
                placeholder="e.g., CS, EE, ME"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="e.g., Computer Science"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!formErrors.description}
                helperText={formErrors.description}
                multiline
                rows={3}
                placeholder="Brief description of the department"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Established Year"
                value={formData.established_year}
                onChange={(e) => handleInputChange('established_year', e.target.value)}
                error={!!formErrors.established_year}
                helperText={formErrors.established_year}
                type="number"
                placeholder="e.g., 2020"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
                {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                type="email"
                placeholder="department@college.edu"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                error={!!formErrors.phone_number}
                helperText={formErrors.phone_number}
                placeholder="9876543210"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Building"
                value={formData.building}
                onChange={(e) => handleInputChange('building', e.target.value)}
                error={!!formErrors.building}
                helperText={formErrors.building}
                placeholder="e.g., Main Building"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Floor"
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
                error={!!formErrors.floor}
                helperText={formErrors.floor}
                placeholder="e.g., 2nd Floor"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room"
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
                error={!!formErrors.room}
                helperText={formErrors.room}
                placeholder="e.g., Room 201"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Campus"
                value={formData.campus}
                onChange={(e) => handleInputChange('campus', e.target.value)}
                error={!!formErrors.campus}
                helperText={formErrors.campus}
                placeholder="e.g., Main Campus"
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Department'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
        severity="success"
      />
    </Box>
  );
};
