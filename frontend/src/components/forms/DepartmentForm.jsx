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
  department_code: yup.string().required('Department code is required'),
  name: yup.string().required('Department name is required'),
  description: yup.string().required('Description is required'),
  hod_id: yup.number().nullable(),
  established_year: yup.number().min(1900, 'Year must be at least 1900').max(new Date().getFullYear(), 'Year cannot be in the future').required('Established year is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  location: yup.object({
    building: yup.string(),
    floor: yup.string(),
    room: yup.string(),
    campus: yup.string()
  }),
  facilities: yup.array().of(yup.string()),
  programs: yup.array().of(yup.object({
    name: yup.string().required('Program name is required'),
    duration: yup.string().required('Duration is required'),
    type: yup.string().required('Program type is required')
  })).min(1, 'At least one program is required'),
  research_areas: yup.array().of(yup.string()).min(1, 'At least one research area is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  total_students: yup.number().min(0, 'Total students cannot be negative'),
  total_faculty: yup.number().min(0, 'Total faculty cannot be negative'),
  budget: yup.number().min(0, 'Budget cannot be negative'),
});

export const DepartmentForm = ({
  open,
  onClose,
  onSubmit,
  faculty = [],
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      department_code: '',
      name: '',
      description: '',
      hod_id: '',
      established_year: new Date().getFullYear(),
      email: '',
      phone_number: '',
      location: {
        building: '',
        floor: '',
        room: '',
        campus: ''
      },
      facilities: [],
      programs: [{ name: '', duration: '', type: '' }],
      research_areas: [],
      status: 'active',
      total_students: 0,
      total_faculty: 0,
      budget: 0,
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
      case 'programs':
        newItem = { name: '', duration: '', type: '' };
        break;
      case 'facilities':
        newItem = '';
        break;
      case 'research_areas':
        newItem = '';
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
    if (typeof field === 'string') {
      updatedArray[index] = value;
    } else {
      updatedArray[index] = { ...updatedArray[index], [field]: value };
    }
    formik.setFieldValue(fieldName, updatedArray);
  };

  const facilityOptions = [
    'Computer Lab', 'Library', 'Conference Room', 'Research Lab', 'Seminar Hall',
    'Staff Room', 'Student Lounge', 'Equipment Room', 'Storage Room', 'Cafeteria'
  ];

  const researchAreaOptions = [
    'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cybersecurity',
    'Software Engineering', 'Computer Networks', 'Database Systems', 'Operating Systems',
    'Computer Architecture', 'Human-Computer Interaction', 'Robotics', 'Computer Vision'
  ];

  const programTypeOptions = [
    'Undergraduate', 'Postgraduate', 'Diploma', 'Certificate', 'PhD'
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Department' : 'Add New Department'}
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
                  name="department_code"
                  label="Department Code"
                  value={formik.values.department_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.department_code && Boolean(formik.errors.department_code)}
                  helperText={formik.touched.department_code && formik.errors.department_code}
                  placeholder="e.g., CS"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Department Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="e.g., Computer Science"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  placeholder="Detailed description of the department"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Head of Department</InputLabel>
                  <Select
                    name="hod_id"
                    value={formik.values.hod_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.hod_id && Boolean(formik.errors.hod_id)}
                    label="Head of Department"
                  >
                    <MenuItem value="">
                      <em>Select HOD</em>
                    </MenuItem>
                    {faculty?.map((fac) => (
                      <MenuItem key={fac.id} value={fac.id}>
                        {fac.first_name} {fac.last_name} - {fac.designation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="established_year"
                  label="Established Year"
                  type="number"
                  value={formik.values.established_year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.established_year && Boolean(formik.errors.established_year)}
                  helperText={formik.touched.established_year && formik.errors.established_year}
                  inputProps={{ min: 1900, max: new Date().getFullYear() }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Department Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  placeholder="department@college.edu"
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="total_students"
                  label="Total Students"
                  type="number"
                  value={formik.values.total_students}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.total_students && Boolean(formik.errors.total_students)}
                  helperText={formik.touched.total_students && formik.errors.total_students}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="total_faculty"
                  label="Total Faculty"
                  type="number"
                  value={formik.values.total_faculty}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.total_faculty && Boolean(formik.errors.total_faculty)}
                  helperText={formik.touched.total_faculty && formik.errors.total_faculty}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="budget"
                  label="Budget (₹)"
                  type="number"
                  value={formik.values.budget}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.budget && Boolean(formik.errors.budget)}
                  helperText={formik.touched.budget && formik.errors.budget}
                  inputProps={{ min: 0, step: 1000 }}
                />
              </Grid>
            </Grid>

            {/* Location Information */}
            <Typography variant="h6">Location Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Building"
                  value={formik.values.location.building}
                  onChange={(e) => formik.setFieldValue('location', { ...formik.values.location, building: e.target.value })}
                  placeholder="e.g., Main Building"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Floor"
                  value={formik.values.location.floor}
                  onChange={(e) => formik.setFieldValue('location', { ...formik.values.location, floor: e.target.value })}
                  placeholder="e.g., 2nd Floor"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room"
                  value={formik.values.location.room}
                  onChange={(e) => formik.setFieldValue('location', { ...formik.values.location, room: e.target.value })}
                  placeholder="e.g., Room 201"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Campus"
                  value={formik.values.location.campus}
                  onChange={(e) => formik.setFieldValue('location', { ...formik.values.location, campus: e.target.value })}
                  placeholder="e.g., Main Campus"
                />
              </Grid>
            </Grid>

            {/* Facilities */}
            <Typography variant="h6">Facilities</Typography>
            <FormControl fullWidth>
              <InputLabel>Available Facilities</InputLabel>
              <Select
                multiple
                name="facilities"
                value={formik.values.facilities}
                onChange={(event) => {
                  const value = event.target.value;
                  formik.setFieldValue('facilities', typeof value === 'string' ? value.split(',') : value);
                }}
                input={<OutlinedInput label="Available Facilities" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {facilityOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={formik.values.facilities.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Research Areas */}
            <Typography variant="h6">Research Areas</Typography>
            <FormControl fullWidth>
              <InputLabel>Research Focus Areas</InputLabel>
              <Select
                multiple
                name="research_areas"
                value={formik.values.research_areas}
                onChange={(event) => {
                  const value = event.target.value;
                  formik.setFieldValue('research_areas', typeof value === 'string' ? value.split(',') : value);
                }}
                input={<OutlinedInput label="Research Focus Areas" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {researchAreaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={formik.values.research_areas.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Academic Programs */}
            <Typography variant="h6">Academic Programs</Typography>
            {formik.values.programs.map((program, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'grey.300', p: 2, borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Program Name"
                      value={program.name}
                      onChange={(e) => updateArrayItem('programs', index, 'name', e.target.value)}
                      placeholder="e.g., B.Tech Computer Science"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Duration"
                      value={program.duration}
                      onChange={(e) => updateArrayItem('programs', index, 'duration', e.target.value)}
                      placeholder="e.g., 4 Years"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Program Type</InputLabel>
                      <Select
                        value={program.type}
                        onChange={(e) => updateArrayItem('programs', index, 'type', e.target.value)}
                        label="Program Type"
                      >
                        {programTypeOptions.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeArrayItem('programs', index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => addArrayItem('programs')}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Program
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
