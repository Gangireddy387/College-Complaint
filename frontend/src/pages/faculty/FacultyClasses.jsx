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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Book as BookIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const FacultyClasses = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Mock data - replace with actual API calls
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'Introduction to Computer Science',
      code: 'CS101',
      subject: 'Computer Science',
      semester: 1,
      year: '2024-2025',
      students: 28,
      maxStudents: 30,
      schedule: 'Mon, Wed, Fri 09:00-10:00',
      room: 'Lab 101',
      credits: 4,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Data Structures & Algorithms',
      code: 'CS201',
      subject: 'Computer Science',
      semester: 2,
      year: '2024-2025',
      students: 25,
      maxStudents: 30,
      schedule: 'Tue, Thu 10:00-11:30',
      room: 'Lab 102',
      credits: 4,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Database Management Systems',
      code: 'CS301',
      subject: 'Computer Science',
      semester: 3,
      year: '2024-2025',
      students: 22,
      maxStudents: 25,
      schedule: 'Mon, Wed 14:00-15:30',
      room: 'Room 205',
      credits: 3,
      status: 'Active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    subject: '',
    semester: '',
    year: '',
    maxStudents: '',
    schedule: '',
    room: '',
    credits: '',
  });

  const subjects = ['Computer Science', 'Mathematics', 'Physics', 'English', 'Chemistry'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const years = ['2024-2025', '2025-2026', '2026-2027'];

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ open: false, message: '', severity: 'info' }), 3000);
  };

  const handleOpenClassForm = (classData = null) => {
    if (classData) {
      setEditingClass(classData);
      setFormData(classData);
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        code: '',
        subject: '',
        semester: '',
        year: '',
        maxStudents: '',
        schedule: '',
        room: '',
        credits: '',
      });
    }
    setShowClassForm(true);
  };

  const handleCloseClassForm = () => {
    setShowClassForm(false);
    setEditingClass(null);
    setFormData({
      name: '',
      code: '',
      subject: '',
      semester: '',
      year: '',
      maxStudents: '',
      schedule: '',
      room: '',
      credits: '',
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.subject) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingClass) {
      // Update existing class
      setClasses(prev => prev.map(cls => 
        cls.id === editingClass.id ? { ...formData, id: cls.id, students: cls.students } : cls
      ));
      showNotification('Class updated successfully', 'success');
    } else {
      // Add new class
      const newClass = {
        ...formData,
        id: Date.now(),
        students: 0,
        status: 'Active',
      };
      setClasses(prev => [...prev, newClass]);
      showNotification('Class added successfully', 'success');
    }
    handleCloseClassForm();
  };

  const handleDelete = (classId) => {
    setClasses(prev => prev.filter(cls => cls.id !== classId));
    showNotification('Class deleted successfully', 'success');
  };

  const getStatusColor = (students, maxStudents) => {
    const percentage = (students / maxStudents) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      {!showClassForm ? (
        // Main Classes Dashboard View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                My Classes
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenClassForm()}
              sx={{ minWidth: 120 }}
            >
              Add Class
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
              {classes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Classes
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {classes.reduce((sum, cls) => sum + cls.students, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Students
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {classes.reduce((sum, cls) => sum + cls.credits, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Credits
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {classes.filter(cls => cls.status === 'Active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Classes
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Classes Grid */}
      <Grid container spacing={3}>
        {classes.map((classItem) => (
          <Grid item xs={12} md={6} key={classItem.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {classItem.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {classItem.code} • {classItem.subject} • Semester {classItem.semester} • {classItem.year}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenClassForm(classItem)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(classItem.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PeopleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Students: {classItem.students}/{classItem.maxStudents}
                  </Typography>
                  <Chip 
                    label={`${Math.round((classItem.students / classItem.maxStudents) * 100)}% Full`} 
                    size="small" 
                    color={getStatusColor(classItem.students, classItem.maxStudents)}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {classItem.schedule}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <BookIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Room: {classItem.room} • Credits: {classItem.credits}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PeopleIcon />}
                    fullWidth
                  >
                    View Students
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ScheduleIcon />}
                    fullWidth
                  >
                    Manage Schedule
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


        </>
      ) : (
        // Class Form View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseClassForm}
              sx={{ minWidth: 120 }}
            >
              Back to Classes
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

          {/* Class Form */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  required
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
                <FormControl fullWidth>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={formData.semester}
                    label="Semester"
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    required
                  >
                    {semesters.map((sem) => (
                      <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={formData.year}
                    label="Year"
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    required
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Schedule"
                  value={formData.schedule}
                  onChange={(e) => handleInputChange('schedule', e.target.value)}
                  placeholder="e.g., Mon, Wed, Fri 09:00-10:00"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room"
                  value={formData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => handleInputChange('credits', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseClassForm}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingClass ? 'Update' : 'Add'} Class
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export { FacultyClasses };
