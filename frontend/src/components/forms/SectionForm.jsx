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
  name: yup.string().required('Section name is required'),
  departmentId: yup.number().required('Department is required'),
  academicYear: yup.string().required('Academic year is required'),
  semester: yup.number().min(1, 'Semester must be at least 1').max(8, 'Semester cannot exceed 8').required('Semester is required'),
  maxStudents: yup.number().min(1, 'Max students must be at least 1').required('Max students is required'),
  classTeacherId: yup.number().nullable(),
});

export const SectionForm = ({
  open,
  onClose,
  onSubmit,
  departments,
  faculty,
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      departmentId: '',
      academicYear: '',
      semester: 1,
      maxStudents: 30,
      classTeacherId: '',
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

  // Filter faculty based on selected department
  const filteredFaculty = faculty?.filter(fac => 
    fac.departmentId === formik.values.departmentId
  ) || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Section' : 'Add New Section'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Section Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="e.g., A, B, C"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="academicYear"
                  label="Academic Year"
                  value={formik.values.academicYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.academicYear && Boolean(formik.errors.academicYear)}
                  helperText={formik.touched.academicYear && formik.errors.academicYear}
                  placeholder="e.g., 2024-25"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="departmentId"
                    value={formik.values.departmentId}
                    onChange={(e) => {
                      formik.setFieldValue('departmentId', e.target.value);
                      formik.setFieldValue('classTeacherId', ''); // Reset class teacher when department changes
                    }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="maxStudents"
                  label="Maximum Students"
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Class Teacher</InputLabel>
                  <Select
                    name="classTeacherId"
                    value={formik.values.classTeacherId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.classTeacherId && Boolean(formik.errors.classTeacherId)}
                    label="Class Teacher"
                    disabled={!formik.values.departmentId}
                  >
                    <MenuItem value="">
                      <em>Select Class Teacher (Optional)</em>
                    </MenuItem>
                    {filteredFaculty.map((fac) => (
                      <MenuItem key={fac.id} value={fac.id}>
                        {fac.firstName} {fac.lastName} - {fac.designation}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.classTeacherId && formik.errors.classTeacherId && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.classTeacherId}
                    </Alert>
                  )}
                </FormControl>
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
              'Add Section'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
