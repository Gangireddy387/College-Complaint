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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Info as InfoIcon,
} from '@mui/icons-material';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

const FacultyClasses = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
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
    {
      id: 4,
      name: 'Web Development',
      code: 'CS401',
      subject: 'Computer Science',
      semester: 4,
      year: '2024-2025',
      students: 20,
      maxStudents: 25,
      schedule: 'Tue, Thu 14:00-15:30',
      room: 'Lab 103',
      credits: 3,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Machine Learning',
      code: 'CS501',
      subject: 'Computer Science',
      semester: 5,
      year: '2024-2025',
      students: 18,
      maxStudents: 20,
      schedule: 'Mon, Wed 16:00-17:30',
      room: 'Room 301',
      credits: 4,
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

  const handleAdd = () => {
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
    setShowClassForm(true);
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      code: classItem.code,
      subject: classItem.subject,
      semester: classItem.semester.toString(),
      year: classItem.year,
      maxStudents: classItem.maxStudents.toString(),
      schedule: classItem.schedule,
      room: classItem.room,
      credits: classItem.credits.toString(),
    });
    setShowClassForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(c => c.id !== id));
      setNotification({
        open: true,
        message: 'Class deleted successfully',
        severity: 'success'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      // Update existing class
      setClasses(prev => prev.map(c => 
        c.id === editingClass.id 
          ? { ...c, ...formData, id: c.id, students: c.students }
          : c
      ));
      setNotification({
        open: true,
        message: 'Class updated successfully',
        severity: 'success'
      });
    } else {
      // Add new class
      const newClass = {
        id: Date.now(),
        ...formData,
        students: 0,
        status: 'Active',
      };
      setClasses(prev => [...prev, newClass]);
      setNotification({
        open: true,
        message: 'Class added successfully',
        severity: 'success'
      });
    }
    setShowClassForm(false);
  };

  const handleCloseForm = () => {
    setShowClassForm(false);
    setEditingClass(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleRowClick = (classItem) => {
    console.log('Class clicked:', classItem);
    // Navigate to class details
  };

  // Convert classes data for ResponsiveTable
  const columns = [
    {
      field: 'name',
      headerName: 'Class Name',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'code',
      headerName: 'Code',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'semester',
      headerName: 'Semester',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'students',
      headerName: 'Students',
      render: (value, row) => (
        <Chip
          label={`${value}/${row.maxStudents}`}
          size="small"
          color={value >= row.maxStudents ? 'error' : value >= row.maxStudents * 0.8 ? 'warning' : 'success'}
          variant="filled"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'schedule',
      headerName: 'Schedule',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'room',
      headerName: 'Room',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'credits',
      headerName: 'Credits',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (value) => (
        <Chip
          label={value}
          size="small"
          color={value === 'Active' ? 'success' : 'error'}
          variant="outlined"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
  ];

  const expandableClassContent = (classItem) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Class Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Class Name:</strong> {classItem.name}
          </Typography>
          <Typography variant="body2">
            <strong>Code:</strong> {classItem.code}
          </Typography>
          <Typography variant="body2">
            <strong>Subject:</strong> {classItem.subject}
          </Typography>
          <Typography variant="body2">
            <strong>Semester:</strong> {classItem.semester}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Schedule:</strong> {classItem.schedule}
          </Typography>
          <Typography variant="body2">
            <strong>Room:</strong> {classItem.room}
          </Typography>
          <Typography variant="body2">
            <strong>Credits:</strong> {classItem.credits}
          </Typography>
          <Typography variant="body2">
            <strong>Enrollment:</strong> {classItem.students}/{classItem.maxStudents} students
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Faculty Classes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={handleAdd}
          >
            Add Class
          </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Manage your classes, view enrollments, and track student progress.
        </Typography>
      </Box>

      {/* Current View Mode Indicator */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mb: 2 }}
      >
        <Typography variant="body2">
          <strong>Current View:</strong> {
            isMobile ? 'Mobile Grid View (Single Column Cards)' :
            isTablet && !isMobile ? 'Tablet Grid View (2-Column Cards)' :
            'Desktop Table View (Full Table)'
          }
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Resize your browser window to see the class data transform into different layouts!
        </Typography>
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {classes.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Classes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PeopleIcon sx={{ fontSize: 32, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {classes.reduce((sum, c) => sum + c.students, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon sx={{ fontSize: 32, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {classes.filter(c => c.status === 'Active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Classes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BookIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {Math.round(classes.reduce((sum, c) => sum + c.students, 0) / classes.reduce((sum, c) => sum + c.maxStudents, 0) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Enrollment
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Responsive Table */}
      <Card>
        <CardContent>
          {classes.length > 0 ? (
            <ResponsiveTable
              columns={columns}
              data={classes}
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              expandable={true}
              expandableContent={expandableClassContent}
              emptyMessage="No classes found"
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Classes Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click "Add Class" to create your first class.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Class Dialog */}
      <Dialog open={showClassForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingClass ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    label="Semester"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <MenuItem key={sem} value={sem}>
                        Semester {sem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Academic Year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Students"
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingClass ? 'Update' : 'Add'} Class
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Alert
        open={notification.open}
        onClose={handleCloseNotification}
        severity={notification.severity}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
      >
        {notification.message}
      </Alert>
    </Box>
  );
};

export default FacultyClasses;
