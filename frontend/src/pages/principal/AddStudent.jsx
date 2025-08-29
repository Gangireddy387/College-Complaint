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

export const AddStudent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    department_id: '',
    admission_year: '',
    current_semester: '',
    enrollment_status: 'active',
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  const [formErrors, setFormErrors] = useState({});

  const { user } = useSelector((state) => state.auth);

  // Mock departments data
  useEffect(() => {
    setDepartments([
      { id: 1, name: 'Computer Science', code: 'CS' },
      { id: 2, name: 'Electrical Engineering', code: 'EE' },
      { id: 3, name: 'Mechanical Engineering', code: 'ME' },
      { id: 4, name: 'Mathematics', code: 'MATH' },
      { id: 5, name: 'Physics', code: 'PHY' }
    ]);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.student_id) errors.student_id = 'Student ID is required';
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone_number) errors.phone_number = 'Phone number is required';
    if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.department_id) errors.department_id = 'Department is required';
    if (!formData.admission_year) errors.admission_year = 'Admission year is required';
    if (!formData.current_semester) errors.current_semester = 'Current semester is required';
    if (!formData.guardian_name) errors.guardian_name = 'Guardian name is required';
    if (!formData.guardian_phone) errors.guardian_phone = 'Guardian phone is required';
    if (!formData.address.street) errors.street = 'Street address is required';
    if (!formData.address.city) errors.city = 'City is required';
    if (!formData.address.state) errors.state = 'State is required';
    if (!formData.address.pincode) errors.pincode = 'Pincode is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const studentData = {
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`,
        total_attendance: 0,
        total_subjects: 0,
        cgpa: 0.0,
        fees_paid: 0,
        total_fees: 50000
      };

      // Create new student
      const newItem = { 
        ...studentData, 
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      // Here you would typically make an API call to save the student
      console.log('Creating new student:', newItem);
      
      setSuccessMessage('Student created successfully');
      
      // Redirect back to students list after a short delay
      setTimeout(() => {
        navigate('/principal/students');
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
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
    navigate('/principal/students');
  };

  return (
    <Box>
      <PageHeader
        title="Add New Student"
        subtitle="Create a new student profile"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Students', path: '/principal/students' },
          { label: 'Add Student', path: '/principal/students/add' },
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
              Student Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details below to create a new student profile
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student ID"
                value={formData.student_id}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                error={!!formErrors.student_id}
                helperText={formErrors.student_id}
                placeholder="e.g., S001, S002"
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
                placeholder="student@college.edu"
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
                label="Date of Birth"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                error={!!formErrors.date_of_birth}
                helperText={formErrors.date_of_birth}
                type="date"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formErrors.gender && <FormHelperText>{formErrors.gender}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Academic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Academic Information
              </Typography>
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
                label="Admission Year"
                value={formData.admission_year}
                onChange={(e) => handleInputChange('admission_year', e.target.value)}
                error={!!formErrors.admission_year}
                helperText={formErrors.admission_year}
                type="number"
                placeholder="e.g., 2024"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Semester"
                value={formData.current_semester}
                onChange={(e) => handleInputChange('current_semester', e.target.value)}
                error={!!formErrors.current_semester}
                helperText={formErrors.current_semester}
                type="number"
                placeholder="e.g., 1"
                inputProps={{ min: 1, max: 8 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Enrollment Status</InputLabel>
                <Select
                  value={formData.enrollment_status}
                  onChange={(e) => handleInputChange('enrollment_status', e.target.value)}
                  label="Enrollment Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="graduated">Graduated</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Guardian Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Guardian Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Guardian Name"
                value={formData.guardian_name}
                onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                error={!!formErrors.guardian_name}
                helperText={formErrors.guardian_name}
                placeholder="e.g., Parent/Guardian Name"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Guardian Phone"
                value={formData.guardian_phone}
                onChange={(e) => handleInputChange('guardian_phone', e.target.value)}
                error={!!formErrors.guardian_phone}
                helperText={formErrors.guardian_phone}
                placeholder="9876543210"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Guardian Email"
                value={formData.guardian_email}
                onChange={(e) => handleInputChange('guardian_email', e.target.value)}
                type="email"
                placeholder="guardian@email.com"
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Address Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                error={!!formErrors.street}
                helperText={formErrors.street}
                placeholder="e.g., 123 Main Street"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                error={!!formErrors.city}
                helperText={formErrors.city}
                placeholder="e.g., Mumbai"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                error={!!formErrors.state}
                helperText={formErrors.state}
                placeholder="e.g., Maharashtra"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pincode"
                value={formData.address.pincode}
                onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                error={!!formErrors.pincode}
                helperText={formErrors.pincode}
                placeholder="e.g., 400001"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                placeholder="e.g., India"
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
              {isLoading ? 'Creating...' : 'Create Student'}
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
