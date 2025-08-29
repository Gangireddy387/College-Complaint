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
  name: yup.string().required('Classroom name is required'),
  capacity: yup.number().min(1, 'Capacity must be at least 1').required('Capacity is required'),
  type: yup.string().required('Classroom type is required'),
  building: yup.string().required('Building is required'),
  floor: yup.number().min(0, 'Floor cannot be negative').required('Floor is required'),
  roomNumber: yup.string().required('Room number is required'),
  facilities: yup.string().required('Facilities description is required'),
});

export const ClassroomForm = ({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      capacity: 30,
      type: 'lecture',
      building: '',
      floor: 0,
      roomNumber: '',
      facilities: '',
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
        {isEditing ? 'Edit Classroom' : 'Add New Classroom'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Classroom Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="e.g., CS Lab 1"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="roomNumber"
                  label="Room Number"
                  value={formik.values.roomNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
                  helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                  placeholder="e.g., 101, A-12"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="building"
                  label="Building"
                  value={formik.values.building}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.building && Boolean(formik.errors.building)}
                  helperText={formik.touched.building && formik.errors.building}
                  placeholder="e.g., Main Block, Engineering Block"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="floor"
                  label="Floor"
                  type="number"
                  value={formik.values.floor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.floor && Boolean(formik.errors.floor)}
                  helperText={formik.touched.floor && formik.errors.floor}
                  inputProps={{ min: 0, max: 20 }}
                  placeholder="0"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Classroom Type</InputLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    label="Classroom Type"
                  >
                    <MenuItem value="lecture">Lecture Hall</MenuItem>
                    <MenuItem value="lab">Laboratory</MenuItem>
                    <MenuItem value="seminar">Seminar Room</MenuItem>
                    <MenuItem value="tutorial">Tutorial Room</MenuItem>
                    <MenuItem value="conference">Conference Room</MenuItem>
                    <MenuItem value="auditorium">Auditorium</MenuItem>
                  </Select>
                  {formik.touched.type && formik.errors.type && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.type}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="capacity"
                  label="Student Capacity"
                  type="number"
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                  helperText={formik.touched.capacity && formik.errors.capacity}
                  inputProps={{ min: 1, max: 500 }}
                  placeholder="30"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="facilities"
                  label="Facilities & Equipment"
                  multiline
                  rows={3}
                  value={formik.values.facilities}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.facilities && Boolean(formik.errors.facilities)}
                  helperText={formik.touched.facilities && formik.errors.facilities}
                  placeholder="Describe available facilities, equipment, and features (e.g., Projector, Whiteboard, Computers, etc.)"
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
              'Add Classroom'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
