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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Box as MuiBox,
  Avatar,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Report as ReportIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

const FacultyAttendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [openComplaintDialog, setOpenComplaintDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [complaintData, setComplaintData] = useState({
    studentId: '',
    studentName: '',
    complaintType: '',
    description: '',
    severity: 'Medium',
    date: new Date().toISOString().split('T')[0],
    classId: '',
    className: '',
  });

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
  ]);

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      studentId: 'STU001',
      studentName: 'John Doe',
      classId: 1,
      className: 'Introduction to Computer Science',
      date: '2023-12-15',
      status: 'present',
      time: '09:00',
      remarks: '',
      lateMinutes: 0,
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: 'Jane Smith',
      classId: 1,
      className: 'Introduction to Computer Science',
      date: '2023-12-15',
      status: 'absent',
      time: '09:00',
      remarks: 'No reason provided',
      lateMinutes: 0,
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      classId: 1,
      className: 'Introduction to Computer Science',
      date: '2023-12-15',
      status: 'late',
      time: '09:15',
      remarks: 'Traffic delay',
      lateMinutes: 15,
    },
  ]);

  // Convert classes data for ResponsiveTable
  const classColumns = [
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
      render: (value) => (
        <Chip
          label={`Sem ${value}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
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
          color={value >= row.maxStudents ? 'error' : 'success'}
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

  // Convert attendance data for ResponsiveTable
  const attendanceColumns = [
    {
      field: 'studentName',
      headerName: 'Student Name',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'studentId',
      headerName: 'Student ID',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'className',
      headerName: 'Class',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'date',
      headerName: 'Date',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'time',
      headerName: 'Time',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (value, row) => (
        <Chip
          label={value === 'present' ? 'Present' : value === 'absent' ? 'Absent' : 'Late'}
          size="small"
          color={value === 'present' ? 'success' : value === 'absent' ? 'error' : 'warning'}
          variant="filled"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      hideOnMobile: true,
      hideOnTablet: false,
    },
  ];

  const handleClassRowClick = (classData) => {
    console.log('Class clicked:', classData);
    // Navigate to class details or show attendance for this class
  };

  const handleAttendanceRowClick = (attendance) => {
    console.log('Attendance clicked:', attendance);
    // Show detailed attendance record
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance);
    setShowAttendanceForm(true);
  };

  const handleDeleteAttendance = (attendance) => {
    console.log('Delete attendance:', attendance);
    // Show confirmation dialog
  };

  const expandableClassContent = (classData) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Class Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Subject:</strong> {classData.subject}
          </Typography>
          <Typography variant="body2">
            <strong>Schedule:</strong> {classData.schedule}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Room:</strong> {classData.room}
          </Typography>
          <Typography variant="body2">
            <strong>Credits:</strong> {classData.credits}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const expandableAttendanceContent = (attendance) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Attendance Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Class:</strong> {attendance.className}
          </Typography>
          <Typography variant="body2">
            <strong>Date:</strong> {attendance.date}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Time:</strong> {attendance.time}
          </Typography>
          {attendance.lateMinutes > 0 && (
            <Typography variant="body2" color="warning.main">
              <strong>Late by:</strong> {attendance.lateMinutes} minutes
            </Typography>
          )}
        </Grid>
      </Grid>
      {attendance.remarks && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <strong>Remarks:</strong> {attendance.remarks}
        </Alert>
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Attendance Management
              </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setShowAttendanceForm(true)}
            >
              Mark Attendance
            </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Manage student attendance for your classes and track attendance records.
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
            isTablet ? 'Tablet Grid View (2-Column Cards)' :
            'Desktop Table View (Full Table)'
          }
            </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Resize your browser window to see the attendance data transform into different layouts!
            </Typography>
      </Alert>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="My Classes" />
          <Tab label="Attendance Records" />
          <Tab label="Reports" />
        </Tabs>

        {/* My Classes Tab */}
        <Box sx={{ p: 3 }}>
      {selectedTab === 0 && (
            <ResponsiveTable
              columns={classColumns}
              data={classes}
              onRowClick={handleClassRowClick}
              onView={(classData) => console.log('View class:', classData)}
              onEdit={(classData) => console.log('Edit class:', classData)}
              expandable={true}
              expandableContent={expandableClassContent}
              emptyMessage="No classes found"
            />
          )}

          {/* Attendance Records Tab */}
      {selectedTab === 1 && (
                        <Box>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                      <InputLabel>Filter by Class</InputLabel>
                <Select
                        value=""
                        onChange={() => {}}
                        label="Filter by Class"
                      >
                        <MenuItem value="">All Classes</MenuItem>
                        {classes.map((classData) => (
                          <MenuItem key={classData.id} value={classData.id}>
                            {classData.name}
                          </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      placeholder="Search by student name..."
                      fullWidth
                    />
            </Grid>
                  <Grid item xs={12} sm={6} md={4}>
              <TextField
                      type="date"
                fullWidth
              />
            </Grid>
          </Grid>
          </Box>

              <ResponsiveTable
                columns={attendanceColumns}
                data={attendanceData}
                onRowClick={handleAttendanceRowClick}
                onEdit={handleEditAttendance}
                onDelete={handleDeleteAttendance}
                expandable={true}
                expandableContent={expandableAttendanceContent}
                emptyMessage="No attendance records found"
              />
            </Box>
          )}

          {/* Reports Tab */}
          {selectedTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Attendance Reports
              </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Overall Attendance
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        92%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average attendance across all classes
                      </Typography>
                    </CardContent>
                  </Card>
              </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Total Students
              </Typography>
                      <Typography variant="h4" color="primary.main">
                        53
                          </Typography>
                  <Typography variant="body2" color="text.secondary">
                        Students across all classes
                  </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
                </Box>
          )}
              </Box>
            </Paper>

      {/* Attendance Form Dialog */}
      <Dialog
        open={showAttendanceForm}
        onClose={() => setShowAttendanceForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAttendance ? 'Edit Attendance' : 'Mark Attendance'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Attendance form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAttendanceForm(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyAttendance;
