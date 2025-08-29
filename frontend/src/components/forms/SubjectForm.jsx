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
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Subject name is required'),
  code: yup.string().required('Subject code is required'),
  description: yup.string().required('Description is required'),
  departmentId: yup.number().required('Department is required'),
  credits: yup.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10').required('Credits are required'),
  semester: yup.number().min(1, 'Semester must be at least 1').max(8, 'Semester cannot exceed 8').required('Semester is required'),
  type: yup.string().required('Subject type is required'),
  maxStudents: yup.number().min(1, 'Max students must be at least 1').required('Max students is required'),
});

export const SubjectForm = ({
  open,
  onClose,
  onSubmit,
  departments,
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      code: '',
      description: '',
      departmentId: '',
      credits: 3,
      semester: 1,
      type: 'theory',
      maxStudents: 30,
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Subject' : 'Add New Subject'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Subject Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="e.g., Data Structures"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="code"
                  label="Subject Code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                  placeholder="e.g., CS201"
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
                  placeholder="Describe the subject, learning objectives, and topics covered..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="departmentId"
                    value={formik.values.departmentId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
                    label="Department"
                  >
                    {departments?.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.departmentId && formik.errors.departmentId && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.departmentId}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Subject Type</InputLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    label="Subject Type"
                  >
                    <MenuItem value="theory">Theory</MenuItem>
                    <MenuItem value="practical">Practical</MenuItem>
                    <MenuItem value="lab">Lab</MenuItem>
                    <MenuItem value="project">Project</MenuItem>
                    <MenuItem value="seminar">Seminar</MenuItem>
                  </Select>
                  {formik.touched.type && formik.errors.type && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.type}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="credits"
                  label="Credits"
                  type="number"
                  value={formik.values.credits}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.credits && Boolean(formik.errors.credits)}
                  helperText={formik.touched.credits && formik.errors.credits}
                  inputProps={{ min: 1, max: 10 }}
                  placeholder="3"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
                  placeholder="1"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="maxStudents"
                  label="Max Students"
                  type="number"
                  value={formik.values.maxStudents}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.maxStudents && Boolean(formik.errors.maxStudents)}
                  helperText={formik.touched.maxStudents && formik.errors.maxStudents}
                  inputProps={{ min: 1, max: 200 }}
                  placeholder="30"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !formik.isValid}
          >
            {isLoading ? (
              <CircularProgress size={20} />
            ) : isEditing ? (
              'Update'
            ) : (
              'Add Subject'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
