import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  time_slot_id: yup.number().required('Time slot is required'),
  date: yup.date().required('Date is required'),
  marked_by: yup.number().required('Faculty member is required'),
  attendances: yup.array().of(yup.object({
    student_id: yup.number().required('Student is required'),
    status: yup.string().oneOf(['present', 'absent', 'late', 'excused']).required('Status is required'),
    late_minutes: yup.number().when('status', {
      is: 'late',
      then: yup.number().min(1, 'Late minutes must be at least 1').max(180, 'Late minutes cannot exceed 3 hours').required('Late minutes required for late status'),
      otherwise: yup.number().nullable()
    }),
    remarks: yup.string().max(500, 'Remarks cannot exceed 500 characters')
  })).min(1, 'At least one student attendance record is required')
});

export const AttendanceForm = ({
  open,
  onClose,
  onSubmit,
  timeSlots = [],
  students = [],
  faculty = [],
  initialValues = null,
  isLoading = false,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      time_slot_id: '',
      date: new Date().toISOString().split('T')[0],
      marked_by: '',
      attendances: []
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setSelectedTimeSlot(null);
    setAvailableStudents([]);
    onClose();
  };

  const handleTimeSlotChange = (timeSlotId) => {
    formik.setFieldValue('time_slot_id', timeSlotId);
    const timeSlot = timeSlots.find(ts => ts.id === timeSlotId);
    setSelectedTimeSlot(timeSlot);
    
    if (timeSlot) {
      // Filter students based on the time slot's section
      const sectionStudents = students.filter(student => 
        student.section_id === timeSlot.section_id
      );
      setAvailableStudents(sectionStudents);
      
      // Initialize attendance records for all students in the section
      const initialAttendances = sectionStudents.map(student => ({
        student_id: student.id,
        status: 'present',
        late_minutes: null,
        remarks: ''
      }));
      formik.setFieldValue('attendances', initialAttendances);
    }
  };

  const updateAttendance = (index, field, value) => {
    const updatedAttendances = [...formik.values.attendances];
    updatedAttendances[index] = { ...updatedAttendances[index], [field]: value };
    
    // Reset late_minutes if status is not 'late'
    if (field === 'status' && value !== 'late') {
      updatedAttendances[index].late_minutes = null;
    }
    
    formik.setFieldValue('attendances', updatedAttendances);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      default: return 'default';
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown Student';
  };

  const getStudentRollNumber = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.student_id : 'N/A';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Attendance' : 'Mark Attendance'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Basic Information */}
            <Typography variant="h6">Attendance Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Time Slot</InputLabel>
                  <Select
                    name="time_slot_id"
                    value={formik.values.time_slot_id}
                    onChange={(e) => handleTimeSlotChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.time_slot_id && Boolean(formik.errors.time_slot_id)}
                    label="Time Slot"
                  >
                    <MenuItem value="">
                      <em>Select Time Slot</em>
                    </MenuItem>
                    {timeSlots.map((ts) => (
                      <MenuItem key={ts.id} value={ts.id}>
                        {ts.day} - {ts.start_time} to {ts.end_time} - {ts.subject?.name || 'Unknown Subject'}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.time_slot_id && formik.errors.time_slot_id && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.time_slot_id}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="date"
                  label="Date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Marked By</InputLabel>
                  <Select
                    name="marked_by"
                    value={formik.values.marked_by}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.marked_by && Boolean(formik.errors.marked_by)}
                    label="Marked By"
                  >
                    <MenuItem value="">
                      <em>Select Faculty Member</em>
                    </MenuItem>
                    {faculty.map((fac) => (
                      <MenuItem key={fac.id} value={fac.id}>
                        {fac.first_name} {fac.last_name} - {fac.designation}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.marked_by && formik.errors.marked_by && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.marked_by}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Time Slot Information */}
            {selectedTimeSlot && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>Time Slot Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Day:</strong> {selectedTimeSlot.day}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Time:</strong> {selectedTimeSlot.start_time} - {selectedTimeSlot.end_time}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Subject:</strong> {selectedTimeSlot.subject?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Faculty:</strong> {selectedTimeSlot.faculty?.first_name} {selectedTimeSlot.faculty?.last_name}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Attendance Records */}
            {availableStudents.length > 0 && (
              <>
                <Typography variant="h6">Student Attendance</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Late Minutes</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formik.values.attendances.map((attendance, index) => (
                        <TableRow key={attendance.student_id}>
                          <TableCell>
                            {getStudentRollNumber(attendance.student_id)}
                          </TableCell>
                          <TableCell>
                            {getStudentName(attendance.student_id)}
                          </TableCell>
                          <TableCell>
                            <FormControl size="small">
                              <RadioGroup
                                row
                                value={attendance.status}
                                onChange={(e) => updateAttendance(index, 'status', e.target.value)}
                              >
                                <FormControlLabel
                                  value="present"
                                  control={<Radio size="small" />}
                                  label={<Chip label="Present" size="small" color="success" />}
                                />
                                <FormControlLabel
                                  value="absent"
                                  control={<Radio size="small" />}
                                  label={<Chip label="Absent" size="small" color="error" />}
                                />
                                <FormControlLabel
                                  value="late"
                                  control={<Radio size="small" />}
                                  label={<Chip label="Late" size="small" color="warning" />}
                                />
                                <FormControlLabel
                                  value="excused"
                                  control={<Radio size="small" />}
                                  label={<Chip label="Excused" size="small" color="info" />}
                                />
                              </RadioGroup>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            {attendance.status === 'late' && (
                              <TextField
                                size="small"
                                type="number"
                                value={attendance.late_minutes || ''}
                                onChange={(e) => updateAttendance(index, 'late_minutes', parseInt(e.target.value) || null)}
                                inputProps={{ min: 1, max: 180 }}
                                placeholder="Minutes"
                                sx={{ width: 80 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={attendance.remarks || ''}
                              onChange={(e) => updateAttendance(index, 'remarks', e.target.value)}
                              placeholder="Optional remarks"
                              sx={{ width: 150 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Summary */}
            {formik.values.attendances.length > 0 && (
              <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Chip
                      label={`Present: ${formik.values.attendances.filter(a => a.status === 'present').length}`}
                      color="success"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Chip
                      label={`Absent: ${formik.values.attendances.filter(a => a.status === 'absent').length}`}
                      color="error"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Chip
                      label={`Late: ${formik.values.attendances.filter(a => a.status === 'late').length}`}
                      color="warning"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Chip
                      label={`Excused: ${formik.values.attendances.filter(a => a.status === 'excused').length}`}
                      color="info"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || formik.values.attendances.length === 0}
          >
            {isLoading ? <CircularProgress size={20} /> : (isEditing ? 'Update' : 'Mark Attendance')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
