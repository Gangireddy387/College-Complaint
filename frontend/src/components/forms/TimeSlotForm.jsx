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
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  subjectId: yup.number().required('Subject is required'),
  facultyId: yup.number().required('Faculty is required'),
  classroomId: yup.number().required('Classroom is required'),
  dayOfWeek: yup.number().required('Day of week is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  maxStudents: yup.number().min(1, 'Max students must be at least 1').required('Max students is required'),
});

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const TimeSlotForm = ({
  open,
  onClose,
  onSubmit,
  subjects,
  faculty,
  classrooms,
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      subjectId: '',
      facultyId: '',
      classroomId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
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

  // Filter faculty and subjects based on selected department (if needed)
  const filteredFaculty = faculty || [];
  const filteredSubjects = subjects || [];
  const filteredClassrooms = classrooms || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Time Slot' : 'Create New Time Slot'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    name="subjectId"
                    value={formik.values.subjectId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.subjectId && Boolean(formik.errors.subjectId)}
                    label="Subject"
                  >
                    {filteredSubjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        <Box>
                          <Typography variant="body2">{subject.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {subject.code} - {subject.credits} credits
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.subjectId && formik.errors.subjectId && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.subjectId}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    name="facultyId"
                    value={formik.values.facultyId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.facultyId && Boolean(formik.errors.facultyId)}
                    label="Faculty"
                  >
                    {filteredFaculty.map((fac) => (
                      <MenuItem key={fac.id} value={fac.id}>
                        <Box>
                          <Typography variant="body2">
                            {fac.firstName} {fac.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fac.designation}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.facultyId && formik.errors.facultyId && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.facultyId}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Classroom</InputLabel>
                  <Select
                    name="classroomId"
                    value={formik.values.classroomId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.classroomId && Boolean(formik.errors.classroomId)}
                    label="Classroom"
                  >
                    {filteredClassrooms.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        <Box>
                          <Typography variant="body2">{room.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Capacity: {room.capacity} | Type: {room.type}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.classroomId && formik.errors.classroomId && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.classroomId}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    name="dayOfWeek"
                    value={formik.values.dayOfWeek}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dayOfWeek && Boolean(formik.errors.dayOfWeek)}
                    label="Day of Week"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.dayOfWeek && formik.errors.dayOfWeek && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.dayOfWeek}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="startTime"
                  label="Start Time"
                  type="time"
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                  helperText={formik.touched.startTime && formik.errors.startTime}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="endTime"
                  label="End Time"
                  type="time"
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                  helperText={formik.touched.endTime && formik.errors.endTime}
                  InputLabelProps={{ shrink: true }}
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
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Schedule Summary:
                  </Typography>
                  {formik.values.subjectId && formik.values.facultyId && formik.values.dayOfWeek && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={filteredSubjects.find(s => s.id === formik.values.subjectId)?.name || 'Subject'}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={DAYS_OF_WEEK.find(d => d.value === formik.values.dayOfWeek)?.label || 'Day'}
                        color="secondary"
                        size="small"
                      />
                      {formik.values.startTime && formik.values.endTime && (
                        <Chip
                          label={`${formik.values.startTime} - ${formik.values.endTime}`}
                          color="info"
                          size="small"
                        />
                      )}
                    </Box>
                  )}
                </Box>
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
              'Create Time Slot'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
