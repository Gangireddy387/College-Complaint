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
  employee_id: yup.string().required('Employee ID is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  designation: yup.string().required('Designation is required'),
  phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  joining_date: yup.date().required('Joining date is required'),
  qualifications: yup.array().of(yup.object({
    degree: yup.string().required('Degree is required'),
    institution: yup.string().required('Institution is required'),
    year: yup.number().required('Year is required'),
    percentage: yup.number().min(0).max(100)
  })).min(1, 'At least one qualification is required'),
  experience: yup.array().of(yup.object({
    position: yup.string().required('Position is required'),
    organization: yup.string().required('Organization is required'),
    from_date: yup.date().required('From date is required'),
    to_date: yup.date().nullable(),
    description: yup.string()
  })),
  achievements: yup.array().of(yup.object({
    title: yup.string().required('Title is required'),
    year: yup.number().required('Year is required'),
    description: yup.string()
  })),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

export const PrincipalForm = ({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      designation: 'Principal',
      phone_number: '',
      joining_date: '',
      qualifications: [{ degree: '', institution: '', year: new Date().getFullYear(), percentage: '' }],
      experience: [{ position: '', organization: '', from_date: '', to_date: '', description: '' }],
      achievements: [{ title: '', year: new Date().getFullYear(), description: '' }],
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
      case 'qualifications':
        newItem = { degree: '', institution: '', year: new Date().getFullYear(), percentage: '' };
        break;
      case 'experience':
        newItem = { position: '', organization: '', from_date: '', to_date: '', description: '' };
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Principal Profile' : 'Add New Principal'}
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
                  name="employee_id"
                  label="Employee ID"
                  value={formik.values.employee_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.employee_id && Boolean(formik.errors.employee_id)}
                  helperText={formik.touched.employee_id && formik.errors.employee_id}
                  placeholder="Enter employee ID"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="designation"
                  label="Designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.designation && Boolean(formik.errors.designation)}
                  helperText={formik.touched.designation && formik.errors.designation}
                  placeholder="e.g., Principal"
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
                  name="joining_date"
                  label="Joining Date"
                  type="date"
                  value={formik.values.joining_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.joining_date && Boolean(formik.errors.joining_date)}
                  helperText={formik.touched.joining_date && formik.errors.joining_date}
                  InputLabelProps={{ shrink: true }}
                />
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
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Qualifications */}
            <Typography variant="h6">Qualifications</Typography>
            {formik.values.qualifications.map((qual, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'grey.300', p: 2, borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Degree"
                      value={qual.degree}
                      onChange={(e) => updateArrayItem('qualifications', index, 'degree', e.target.value)}
                      placeholder="e.g., Ph.D."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Institution"
                      value={qual.institution}
                      onChange={(e) => updateArrayItem('qualifications', index, 'institution', e.target.value)}
                      placeholder="University name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Year"
                      type="number"
                      value={qual.year}
                      onChange={(e) => updateArrayItem('qualifications', index, 'year', parseInt(e.target.value))}
                      inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Percentage/CGPA"
                      value={qual.percentage}
                      onChange={(e) => updateArrayItem('qualifications', index, 'percentage', e.target.value)}
                      placeholder="e.g., 85% or 3.8"
                    />
                  </Grid>
                </Grid>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeArrayItem('qualifications', index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => addArrayItem('qualifications')}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Qualification
            </Button>

            {/* Experience */}
            <Typography variant="h6">Work Experience</Typography>
            {formik.values.experience.map((exp, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'grey.300', p: 2, borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={exp.position}
                      onChange={(e) => updateArrayItem('experience', index, 'position', e.target.value)}
                      placeholder="Job title"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Organization"
                      value={exp.organization}
                      onChange={(e) => updateArrayItem('experience', index, 'organization', e.target.value)}
                      placeholder="Company/Institution"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="From Date"
                      type="date"
                      value={exp.from_date}
                      onChange={(e) => updateArrayItem('experience', index, 'from_date', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="To Date"
                      type="date"
                      value={exp.to_date}
                      onChange={(e) => updateArrayItem('experience', index, 'to_date', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={2}
                      value={exp.description}
                      onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                      placeholder="Brief description of responsibilities"
                    />
                  </Grid>
                </Grid>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeArrayItem('experience', index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => addArrayItem('experience')}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Experience
            </Button>

            {/* Achievements */}
            <Typography variant="h6">Achievements & Awards</Typography>
            {formik.values.achievements.map((achievement, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'grey.300', p: 2, borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={achievement.title}
                      onChange={(e) => updateArrayItem('achievements', index, 'title', e.target.value)}
                      placeholder="Award/Recognition title"
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
