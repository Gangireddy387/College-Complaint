import React, { useState, useEffect } from 'react';
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
  Avatar,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';

export const AddFaculty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    designation: '',
    department_id: '',
    specializations: [],
    current_workload: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  const { user } = useSelector((state) => state.auth);

  // Mock departments data
  useEffect(() => {
    setDepartments([
      { id: 1, name: 'Computer Science', code: 'CS' },
      { id: 2, name: 'Electrical Engineering', code: 'EE' },
      { id: 3, name: 'Mechanical Engineering', code: 'ME' },
    ]);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id) errors.employee_id = 'Employee ID is required';
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone_number) errors.phone_number = 'Phone number is required';
    if (!formData.designation) errors.designation = 'Designation is required';
    if (!formData.department_id) errors.department_id = 'Department is required';
    if (!formData.current_workload) errors.current_workload = 'Current workload is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const facultyData = {
        ...formData,
        specializations: formData.specializations.length > 0 ? formData.specializations : ['General'],
        total_students: 0,
        total_courses: 0
      };

      // Create new faculty member
      const newItem = { 
        ...facultyData, 
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      // Here you would typically make an API call to save the faculty member
      console.log('Creating new faculty member:', newItem);
      
      setSuccessMessage('Faculty member created successfully');
      
      // Redirect back to faculty list after a short delay
      setTimeout(() => {
        navigate('/principal/faculty');
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

  const handleSpecializationChange = (value) => {
    if (value && !formData.specializations.includes(value)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, value]
      }));
    }
  };

  const removeSpecialization = (index) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCancel = () => {
    navigate('/principal/faculty');
  };

  return (
    <Box>
      <PageHeader
        title="Add New Faculty Member"
        subtitle="Create a new faculty member profile"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Management', path: '/principal/management' },
          { label: 'Faculty', path: '/principal/faculty' },
          { label: 'Add Faculty', path: '/principal/faculty/add' },
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
              Faculty Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details below to create a new faculty member profile
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employee_id}
                onChange={(e) => handleInputChange('employee_id', e.target.value)}
                error={!!formErrors.employee_id}
                helperText={formErrors.employee_id}
                placeholder="e.g., F001, F002"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
                placeholder="e.g., John"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
                placeholder="e.g., Doe"
                required
              />
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
                placeholder="faculty@college.edu"
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
                label="Designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                error={!!formErrors.designation}
                helperText={formErrors.designation}
                placeholder="e.g., Assistant Professor"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.department_id}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department_id}
                  onChange={(e) => handleInputChange('department_id', e.target.value)}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.code} - {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.department_id && <FormHelperText>{formErrors.department_id}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Workload (hours/week)"
                value={formData.current_workload}
                onChange={(e) => handleInputChange('current_workload', e.target.value)}
                error={!!formErrors.current_workload}
                helperText={formErrors.current_workload}
                type="number"
                placeholder="e.g., 16"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Specialization"
                placeholder="Type and press Enter to add specialization"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSpecializationChange(e.target.value);
                    e.target.value = '';
                  }
                }}
                helperText="Press Enter to add each specialization"
              />
            </Grid>
            {formData.specializations.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.specializations.map((spec, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        fontSize: '0.875rem'
                      }}
                    >
                      {spec}
                      <Button
                        size="small"
                        sx={{ ml: 1, minWidth: 'auto', color: 'white' }}
                        onClick={() => removeSpecialization(index)}
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                </Select>
              </FormControl>
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
              {isLoading ? 'Creating...' : 'Create Faculty Member'}
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
