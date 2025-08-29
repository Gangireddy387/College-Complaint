import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Book as BookIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const FacultyTimetable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Mock data - replace with actual API calls
  const [timeSlots, setTimeSlots] = useState([
    {
      id: 1,
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'Introduction to Computer Science',
      classCode: 'CS101',
      room: 'Lab 101',
      type: 'Lecture',
      students: 28,
      maxStudents: 30,
      status: 'Active',
    },
    {
      id: 2,
      day: 'Monday',
      startTime: '14:00',
      endTime: '16:00',
      subject: 'Introduction to Computer Science',
      classCode: 'CS101',
      room: 'Lab 101',
      type: 'Practical',
      students: 28,
      maxStudents: 30,
      status: 'Active',
    },
    {
      id: 3,
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'Introduction to Computer Science',
      classCode: 'CS101',
      room: 'Lab 101',
      type: 'Lecture',
      students: 28,
      maxStudents: 30,
      status: 'Active',
    },
    {
      id: 4,
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '16:00',
      subject: 'Introduction to Computer Science',
      classCode: 'CS101',
      room: 'Lab 101',
      type: 'Practical',
      students: 28,
      maxStudents: 30,
      status: 'Active',
    },
    {
      id: 5,
      day: 'Friday',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'Introduction to Computer Science',
      classCode: 'CS101',
      room: 'Lab 101',
      type: 'Lecture',
      students: 28,
      maxStudents: 30,
      status: 'Active',
    },
    {
      id: 6,
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '11:30',
      subject: 'Data Structures & Algorithms',
      classCode: 'CS201',
      room: 'Lab 102',
      type: 'Lecture',
      students: 25,
      maxStudents: 30,
      status: 'Active',
    },
    {
      id: 7,
      day: 'Thursday',
      startTime: '10:00',
      endTime: '11:30',
      subject: 'Data Structures & Algorithms',
      classCode: 'CS201',
      room: 'Lab 102',
      type: 'Lecture',
      students: 25,
      maxStudents: 30,
      status: 'Active',
    },
  ]);

  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    subject: '',
    classCode: '',
    room: '',
    type: '',
    maxStudents: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classTypes = ['Lecture', 'Tutorial', 'Practical', 'Discussion', 'Lab', 'Seminar'];
  const subjects = ['Introduction to Computer Science', 'Data Structures & Algorithms', 'Database Management Systems'];
  const rooms = ['Lab 101', 'Lab 102', 'Room 205', 'Room 206', 'Auditorium A'];

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ open: false, message: '', severity: 'info' }), 3000);
  };

  const handleOpenTimeSlotForm = (slotData = null) => {
    if (slotData) {
      setEditingSlot(slotData);
      setFormData(slotData);
    } else {
      setEditingSlot(null);
      setFormData({
        day: '',
        startTime: '',
        endTime: '',
        subject: '',
        classCode: '',
        room: '',
        type: '',
        maxStudents: '',
      });
    }
    setShowTimeSlotForm(true);
  };

  const handleCloseTimeSlotForm = () => {
    setShowTimeSlotForm(false);
    setEditingSlot(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.day || !formData.startTime || !formData.endTime || !formData.subject) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingSlot) {
      // Update existing time slot
      setTimeSlots(prev => prev.map(slot => 
        slot.id === editingSlot.id ? { ...formData, id: slot.id, students: slot.students, status: slot.status } : slot
      ));
      showNotification('Time slot updated successfully', 'success');
    } else {
      // Add new time slot
      const newSlot = {
        ...formData,
        id: Date.now(),
        students: 0,
        status: 'Active',
      };
      setTimeSlots(prev => [...prev, newSlot]);
      showNotification('Time slot added successfully', 'success');
    }
    handleCloseTimeSlotForm();
  };

  const handleDelete = (slotId) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== slotId));
    showNotification('Time slot deleted successfully', 'success');
  };

  const handleDayChange = (event, newValue) => {
    setSelectedDay(newValue);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Lecture': return 'primary';
      case 'Tutorial': return 'secondary';
      case 'Practical': return 'success';
      case 'Discussion': return 'info';
      case 'Lab': return 'warning';
      case 'Seminar': return 'error';
      default: return 'default';
    }
  };

  const getDaySlots = (day) => {
    return timeSlots.filter(slot => slot.day === day);
  };

  const totalHours = timeSlots.reduce((sum, slot) => {
    const start = new Date(`2000-01-01T${slot.startTime}`);
    const end = new Date(`2000-01-01T${slot.endTime}`);
    return sum + (end - start) / (1000 * 60 * 60);
  }, 0);

  return (
    <Box sx={{ p: 3 }}>
      {!showTimeSlotForm ? (
        // Main Timetable Dashboard View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ScheduleIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                My Timetable
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenTimeSlotForm()}
              sx={{ minWidth: 120 }}
            >
              Add Time Slot
            </Button>
          </Box>

      {notification.open && (
        <Alert
          severity={notification.severity}
          sx={{ mb: 3 }}
          onClose={() => setNotification({ open: false, message: '', severity: 'info' })}
        >
          {notification.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {timeSlots.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Time Slots
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {totalHours.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Hours
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {timeSlots.filter(slot => slot.status === 'Active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Slots
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {timeSlots.reduce((sum, slot) => sum + slot.students, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Students
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Day Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedDay}
          onChange={handleDayChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {days.map((day, index) => (
            <Tab key={day} label={day} />
          ))}
        </Tabs>
      </Paper>

      {/* Selected Day Schedule */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main }}>
          {days[selectedDay]} Schedule
        </Typography>

        {getDaySlots(days[selectedDay]).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No classes scheduled for {days[selectedDay]}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {getDaySlots(days[selectedDay]).map((slot) => (
              <Grid item xs={12} md={6} key={slot.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {slot.startTime} - {slot.endTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {slot.classCode}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={slot.type} 
                          size="small" 
                          color={getTypeColor(slot.type)}
                          variant="outlined"
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleOpenTimeSlotForm(slot)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(slot.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" gutterBottom fontWeight="600">
                      {slot.subject}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {slot.room}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <SchoolIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Students: {slot.students}/{slot.maxStudents}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<BookIcon />}
                        fullWidth
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<SchoolIcon />}
                        fullWidth
                      >
                        Manage Class
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Weekly Overview */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Weekly Overview
        </Typography>
        <Grid container spacing={2}>
          {days.map((day, index) => (
            <Grid item xs={6} sm={4} md={2} key={day}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {day}
                </Typography>
                <Typography variant="h4" color="primary">
                  {getDaySlots(day).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Classes
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>


        </>
      ) : (
        // Time Slot Form View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ScheduleIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseTimeSlotForm}
              sx={{ minWidth: 120 }}
            >
              Back to Timetable
            </Button>
          </Box>

          {notification.open && (
            <Alert
              severity={notification.severity}
              sx={{ mb: 3 }}
              onClose={() => setNotification({ open: false, message: '', severity: 'info' })}
            >
              {notification.message}
            </Alert>
          )}

          {/* Time Slot Form */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={formData.day}
                    label="Day"
                    onChange={(e) => handleInputChange('day', e.target.value)}
                    required
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>{day}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Class Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Class Type"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                  >
                    {classTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={formData.subject}
                    label="Subject"
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Code"
                  value={formData.classCode}
                  onChange={(e) => handleInputChange('classCode', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={formData.room}
                    label="Room"
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    required
                  >
                    {rooms.map((room) => (
                      <MenuItem key={room} value={room}>{room}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Students"
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseTimeSlotForm}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingSlot ? 'Update' : 'Add'} Time Slot
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export { FacultyTimetable };
