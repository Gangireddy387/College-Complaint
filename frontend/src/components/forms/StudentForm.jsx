import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  student_id: yup.string().required('Student ID is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  department_id: yup.number().required('Department is required'),
  semester: yup.number().min(1, 'Semester must be at least 1').max(8, 'Semester cannot exceed 8').required('Semester is required'),
  phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  date_of_birth: yup.date().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  address: yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    pincode: yup.string().required('Pincode is required')
  }),
  guardian_info: yup.object({
    name: yup.string().required('Guardian name is required'),
    phone: yup.string().required('Guardian phone is required'),
    relationship: yup.string().required('Relationship is required'),
    email: yup.string().email('Invalid guardian email')
  }),
  academic_history: yup.array().of(yup.object({
    year: yup.string().required('Academic year is required'),
    semester: yup.number().required('Semester is required'),
    cgpa: yup.number().min(0).max(10).required('CGPA is required')
  })),
  achievements: yup.array().of(yup.object({
    title: yup.string().required('Achievement title is required'),
    year: yup.number().required('Year is required'),
    description: yup.string()
  })),
  status: yup.string().oneOf(['active', 'inactive', 'alumni', 'suspended']).required('Status is required'),
});

export const StudentForm = ({
  open,
  onClose,
  onSubmit,
  departments = [],
  sections = [],
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      department_id: '',
      semester: 1,
      phone_number: '',
      date_of_birth: '',
      gender: 'male',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      guardian_info: {
        name: '',
        phone: '',
        relationship: 'Father',
        email: ''
      },
      academic_history: [{ year: '2023-2024', semester: 1, cgpa: 0.0 }],
      achievements: [],
      status: 'active',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const addArrayItem = (fieldName) => {
    const currentArray = formik.values[fieldName];
    let newItem = {};
    
    switch (fieldName) {
      case 'academic_history':
        newItem = { year: '2023-2024', semester: 1, cgpa: 0.0 };
        break;
      case 'achievements':
        newItem = { title: '', year: new Date().getFullYear(), description: '' };
        break;
      default:
        newItem = {};
    }
    
    formik.setFieldValue(fieldName, [...currentArray, newItem]);
  };

  const removeArrayItem = (fieldName, index) => {
    const currentArray = formik.values[fieldName];
    const newArray = currentArray.filter((_, i) => i !== index);
    formik.setFieldValue(fieldName, newArray);
  };

  const updateArrayItem = (fieldName, index, field, value) => {
    const currentArray = formik.values[fieldName];
    const updatedArray = [...currentArray];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    formik.setFieldValue(fieldName, updatedArray);
  };

  const relationshipOptions = ['Father', 'Mother', 'Guardian', 'Sibling', 'Other'];

  // Filter sections based on selected department
  const filteredSections = sections?.filter(section => 
    section.department_id === formik.values.department_id
  ) || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Student' : 'Add New Student'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Basic Information */}
            <Typography variant="h6">Basic Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="student_id"
                  label="Student ID"
                  value={formik.values.student_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.student_id && Boolean(formik.errors.student_id)}
                  helperText={formik.touched.student_id && formik.errors.student_id}
                  placeholder="Enter student ID"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="first_name"
                  label="First Name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  placeholder="Enter first name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="last_name"
                  label="Last Name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  placeholder="Enter last name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  placeholder="Enter email address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  placeholder="Enter password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department_id"
                    value={formik.values.department_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                    label="Department"
                  >
                    <MenuItem value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {departments?.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.department_id && formik.errors.department_id && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.department_id}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="semester"
                  label="Semester"
                  type="number"
                  value={formik.values.semester}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.semester && Boolean(formik.errors.semester)}
                  helperText={formik.touched.semester && formik.errors.semester}
                  inputProps={{ min: 1, max: 8 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone_number"
                  label="Phone Number"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                  helperText={formik.touched.phone_number && formik.errors.phone_number}
                  placeholder="10 digit phone number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  value={formik.values.date_of_birth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                  helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.gender}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="alumni">Alumni</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Address Information */}
            <Typography variant="h6">Address Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={formik.values.address.street}
                  onChange={(e) => formik.setFieldValue('address', { ...formik.values.address, street: e.target.value })}
                  placeholder="Enter street address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formik.values.address.city}
                  onChange={(e) => formik.setFieldValue('address', { ...formik.values.address, city: e.target.value })}
                  placeholder="Enter city"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={formik.values.address.state}
                  onChange={(e) => formik.setFieldValue('address', { ...formik.values.address, state: e.target.value })}
                  placeholder="Enter state"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={formik.values.address.pincode}
                  onChange={(e) => formik.setFieldValue('address', { ...formik.values.address, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </Grid>
            </Grid>

            {/* Guardian Information */}
            <Typography variant="h6">Guardian Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guardian Name"
                  value={formik.values.guardian_info.name}
                  onChange={(e) => formik.setFieldValue('guardian_info', { ...formik.values.guardian_info, name: e.target.value })}
                  placeholder="Enter guardian name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guardian Phone"
                  value={formik.values.guardian_info.phone}
                  onChange={(e) => formik.setFieldValue('guardian_info', { ...formik.values.guardian_info, phone: e.target.value })}
                  placeholder="Enter guardian phone"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    value={formik.values.guardian_info.relationship}
                    onChange={(e) => formik.setFieldValue('guardian_info', { ...formik.values.guardian_info, relationship: e.target.value })}
                    label="Relationship"
                  >
                    {relationshipOptions.map((rel) => (
                      <MenuItem key={rel} value={rel}>
                        {rel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guardian Email"
                  type="email"
                  value={formik.values.guardian_info.email}
                  onChange={(e) => formik.setFieldValue('guardian_info', { ...formik.values.guardian_info, email: e.target.value })}
                  placeholder="Enter guardian email (optional)"
                />
              </Grid>
            </Grid>

            {/* Academic History */}
            <Typography variant="h6">Academic History</Typography>
            {formik.values.academic_history.map((record, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'grey.300', p: 2, borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Academic Year"
                      value={record.year}
                      onChange={(e) => updateArrayItem('academic_history', index, 'year', e.target.value)}
                      placeholder="e.g., 2023-2024"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Semester"
                      type="number"
                      value={record.semester}
                      onChange={(e) => updateArrayItem('academic_history', index, 'semester', parseInt(e.target.value))}
                      inputProps={{ min: 1, max: 8 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="CGPA"
                      type="number"
                      value={record.cgpa}
                      onChange={(e) => updateArrayItem('academic_history', index, 'cgpa', parseFloat(e.target.value))}
                      inputProps={{ min: 0, max: 10, step: 0.01 }}
                    />
                  </Grid>
                </Grid>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeArrayItem('academic_history', index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => addArrayItem('academic_history')}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Academic Record
            </Button>

            {/* Achievements */}
            <Typography variant="h6">Achievements & Awards</Typography>
            {formik.values.achievements.map((achievement, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'grey.300', p: 2, borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Achievement Title"
                      value={achievement.title}
                      onChange={(e) => updateArrayItem('achievements', index, 'title', e.target.value)}
                      placeholder="e.g., Dean's List"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Year"
                      type="number"
                      value={achievement.year}
                      onChange={(e) => updateArrayItem('achievements', index, 'year', parseInt(e.target.value))}
                      inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={2}
                      value={achievement.description}
                      onChange={(e) => updateArrayItem('achievements', index, 'description', e.target.value)}
                      placeholder="Brief description of the achievement"
                    />
                  </Grid>
                </Grid>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeArrayItem('achievements', index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => addArrayItem('achievements')}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Achievement
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : (isEditing ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
