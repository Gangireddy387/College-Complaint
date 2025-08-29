import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  status: yup.string().required('Status is required'),
  lateMinutes: yup.number().min(0, 'Late minutes cannot be negative'),
  remarks: yup.string(),
});

export const AttendanceForm = ({
  open,
  onClose,
  onSubmit,
  students,
  timeSlot,
  isLoading = false,
}) => {
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    if (students && open) {
      const initialData = {};
      students.forEach(student => {
        initialData[student.id] = {
          status: 'present',
          lateMinutes: 0,
          remarks: '',
        };
      });
      setAttendanceData(initialData);
    }
  }, [students, open]);

  const handleSubmit = () => {
    const formattedData = Object.entries(attendanceData).map(([studentId, data]) => ({
      studentId: parseInt(studentId),
      ...data,
    }));
    onSubmit(formattedData);
  };

  const updateAttendance = (studentId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!students || students.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Mark Attendance - {timeSlot?.subject?.name} ({timeSlot?.startTime} - {timeSlot?.endTime})
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {students.map((student) => (
              <Grid item xs={12} key={student.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h6">
                        {student.firstName} {student.lastName}
                      </Typography>
                      <Chip
                        label={student.rollNumber}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={attendanceData[student.id]?.status || 'present'}
                            onChange={(e) => updateAttendance(student.id, 'status', e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="present">Present</MenuItem>
                            <MenuItem value="absent">Absent</MenuItem>
                            <MenuItem value="late">Late</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Late Minutes"
                          value={attendanceData[student.id]?.lateMinutes || 0}
                          onChange={(e) => updateAttendance(student.id, 'lateMinutes', parseInt(e.target.value) || 0)}
                          disabled={attendanceData[student.id]?.status !== 'late'}
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Remarks"
                          value={attendanceData[student.id]?.remarks || ''}
                          onChange={(e) => updateAttendance(student.id, 'remarks', e.target.value)}
                          placeholder="Optional remarks..."
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            'Submit Attendance'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
