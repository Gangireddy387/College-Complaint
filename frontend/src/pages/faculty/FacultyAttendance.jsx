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
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Box as MuiBox,
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
} from '@mui/icons-material';

const FacultyAttendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      classId: 1,
      className: 'Introduction to Computer Science',
      date: '2024-01-15',
      markedBy: 'Dr. Smith',
      totalStudents: 28,
      present: 25,
      absent: 2,
      late: 1,
      status: 'Completed',
    },
    {
      id: 2,
      classId: 1,
      className: 'Introduction to Computer Science',
      date: '2024-01-17',
      markedBy: 'Dr. Smith',
      totalStudents: 28,
      present: 26,
      absent: 1,
      late: 1,
      status: 'Completed',
    },
    {
      id: 3,
      classId: 2,
      className: 'Data Structures & Algorithms',
      date: '2024-01-16',
      markedBy: 'Dr. Smith',
      totalStudents: 25,
      present: 23,
      absent: 2,
      late: 0,
      status: 'Completed',
    },
  ]);

  const [formData, setFormData] = useState({
    classId: '',
    date: new Date().toISOString().split('T')[0],
    markedBy: 'Dr. Smith',
    students: [],
  });

  const [studentAttendance, setStudentAttendance] = useState([]);

  // Constants for complaint system
  const complaintTypes = [
    'Disruptive Behavior',
    'Academic Dishonesty',
    'Attendance Issues',
    'Bullying/Harassment',
    'Property Damage',
    'Dress Code Violation',
    'Technology Misuse',
    'Late Arrival',
    'Early Departure',
    'Other'
  ];
  
  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ open: false, message: '', severity: 'info' }), 3000);
  };

  const handleOpenDialog = (attendanceData = null) => {
    if (attendanceData) {
      setEditingAttendance(attendanceData);
      setFormData({
        classId: attendanceData.classId,
        date: attendanceData.date,
        markedBy: attendanceData.markedBy,
        students: [],
      });
    } else {
      setEditingAttendance(null);
      setFormData({
        classId: '',
        date: new Date().toISOString().split('T')[0],
        markedBy: 'Dr. Smith',
        students: [],
      });
    }
    setShowAttendanceForm(true);
  };

  const handleCloseDialog = () => {
    setShowAttendanceForm(false);
    setEditingAttendance(null);
    setStudentAttendance([]);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClassChange = (classId) => {
    handleInputChange('classId', classId);
    // Generate student list for the selected class
    const selectedClass = classes.find(cls => cls.id === classId);
    if (selectedClass) {
      const mockStudents = [
        { id: 1, name: 'John Doe', studentId: 'STU001', status: 'present' },
        { id: 2, name: 'Jane Smith', studentId: 'STU002', status: 'present' },
        { id: 3, name: 'Mike Johnson', studentId: 'STU003', status: 'present' },
        { id: 4, name: 'Sarah Wilson', studentId: 'STU004', status: 'present' },
        { id: 5, name: 'David Brown', studentId: 'STU005', status: 'present' },
        { id: 6, name: 'Emily Davis', studentId: 'STU006', status: 'present' },
        { id: 7, name: 'Chris Lee', studentId: 'STU007', status: 'present' },
        { id: 8, name: 'Lisa Garcia', studentId: 'STU008', status: 'present' },
        { id: 9, name: 'Tom Martinez', studentId: 'STU009', status: 'present' },
        { id: 10, name: 'Anna Taylor', studentId: 'STU010', status: 'present' },
      ];
      setStudentAttendance(mockStudents);
    }
  };

  const handleStudentStatusChange = (studentId, status) => {
    setStudentAttendance(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const handleSubmit = () => {
    if (!formData.classId || !formData.date) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (studentAttendance.length === 0) {
      showNotification('No students found for the selected class', 'error');
      return;
    }

    const present = studentAttendance.filter(s => s.status === 'present').length;
    const absent = studentAttendance.filter(s => s.status === 'absent').length;
    const late = studentAttendance.filter(s => s.status === 'late').length;

    if (editingAttendance) {
      // Update existing attendance
      setAttendanceRecords(prev => prev.map(record => 
        record.id === editingAttendance.id ? {
          ...record,
          date: formData.date,
          present,
          absent,
          late,
        } : record
      ));
      showNotification('Attendance updated successfully', 'success');
    } else {
      // Add new attendance
      const selectedClass = classes.find(cls => cls.id === formData.classId);
      const newAttendance = {
        id: Date.now(),
        classId: formData.classId,
        className: selectedClass.name,
        date: formData.date,
        markedBy: formData.markedBy,
        totalStudents: studentAttendance.length,
        present,
        absent,
        late,
        status: 'Completed',
      };
      setAttendanceRecords(prev => [...prev, newAttendance]);
      showNotification('Attendance marked successfully', 'success');
    }
    handleCloseDialog();
  };

  const handleDelete = (attendanceId) => {
    setAttendanceRecords(prev => prev.filter(record => record.id !== attendanceId));
    showNotification('Attendance record deleted successfully', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Draft': return 'info';
      default: return 'default';
    }
  };

  const getAttendancePercentage = (present, total) => {
    return Math.round((present / total) * 100);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Complaint handling functions
  const handleOpenComplaintDialog = (student) => {
    setSelectedStudent(student);
    setComplaintData({
      studentId: student.studentId,
      studentName: student.name,
      complaintType: '',
      description: '',
      severity: 'Medium',
      date: new Date().toISOString().split('T')[0],
      classId: formData.classId,
      className: classes.find(cls => cls.id === formData.classId)?.name || '',
    });
    setOpenComplaintDialog(true);
  };

  const handleCloseComplaintDialog = () => {
    setOpenComplaintDialog(false);
    setSelectedStudent(null);
    setComplaintData({
      studentId: '',
      studentName: '',
      complaintType: '',
      description: '',
      severity: 'Medium',
      date: new Date().toISOString().split('T')[0],
      classId: '',
      className: '',
    });
  };

  const handleComplaintInputChange = (field, value) => {
    setComplaintData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitComplaint = () => {
    if (!complaintData.complaintType || !complaintData.description) {
      showNotification('Please fill in all required fields for the complaint', 'error');
      return;
    }

    // Here you would typically send the complaint to your backend
    // For now, we'll just show a success message
    showNotification('Complaint submitted successfully', 'success');
    handleCloseComplaintDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      {!showAttendanceForm ? (
        // Main Attendance Dashboard View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ScheduleIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                Mark Attendance
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ minWidth: 120 }}
            >
              Mark Attendance
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
              {attendanceRecords.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Records
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {attendanceRecords.reduce((sum, record) => sum + record.present, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Present
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {attendanceRecords.reduce((sum, record) => sum + record.absent, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Absent
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {attendanceRecords.reduce((sum, record) => sum + record.late, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Late
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Attendance Records" />
          <Tab label="Class Overview" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Recent Attendance Records
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Class</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Students</TableCell>
                  <TableCell>Present</TableCell>
                  <TableCell>Absent</TableCell>
                  <TableCell>Late</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {record.className}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {record.markedBy}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.totalStudents}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        {record.present}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error.main" fontWeight="medium">
                        {record.absent}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="warning.main" fontWeight="medium">
                        {record.late}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${getAttendancePercentage(record.present, record.totalStudents)}%`}
                        size="small"
                        color={getAttendancePercentage(record.present, record.totalStudents) >= 80 ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={record.status} 
                        size="small" 
                        color={getStatusColor(record.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(record)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(record.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Class Attendance Overview
          </Typography>
          
          <Grid container spacing={3}>
            {classes.map((classItem) => {
              const classAttendance = attendanceRecords.filter(record => record.classId === classItem.id);
              const avgPresent = classAttendance.length > 0 
                ? Math.round(classAttendance.reduce((sum, record) => sum + record.present, 0) / classAttendance.length)
                : 0;
              const avgPercentage = classAttendance.length > 0 
                ? Math.round(classAttendance.reduce((sum, record) => sum + getAttendancePercentage(record.present, record.totalStudents), 0) / classAttendance.length)
                : 0;

              return (
                <Grid item xs={12} md={6} key={classItem.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {classItem.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {classItem.code} • {classItem.schedule}
                          </Typography>
                        </Box>
                        <Chip 
                          label={`${avgPercentage}%`}
                          size="small"
                          color={avgPercentage >= 80 ? 'success' : avgPercentage >= 60 ? 'warning' : 'error'}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Students: {classItem.students}/{classItem.maxStudents}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Records: {classAttendance.length}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                        <Typography variant="body2" color="text.secondary">
                          Avg Present: {avgPresent}
                        </Typography>
                      </Box>

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        fullWidth
                                                 onClick={() => {
                           setFormData(prev => ({ ...prev, classId: classItem.id }));
                           handleClassChange(classItem.id);
                           setShowAttendanceForm(true);
                         }}
                      >
                        Mark Attendance
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}

      

      {/* Complaint Dialog */}
      <Dialog open={openComplaintDialog} onClose={handleCloseComplaintDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportIcon color="error" />
            <Typography variant="h6">
              Report Student Issue
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                value={complaintData.studentName}
                InputProps={{ readOnly: true }}
                sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                value={complaintData.studentId}
                InputProps={{ readOnly: true }}
                sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class"
                value={complaintData.className}
                InputProps={{ readOnly: true }}
                sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={complaintData.date}
                onChange={(e) => handleComplaintInputChange('date', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Issue Type</InputLabel>
                <Select
                  value={complaintData.complaintType}
                  label="Issue Type"
                  onChange={(e) => handleComplaintInputChange('complaintType', e.target.value)}
                  required
                >
                  {complaintTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={complaintData.severity}
                  label="Severity"
                  onChange={(e) => handleComplaintInputChange('severity', e.target.value)}
                  required
                >
                  {severityLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={complaintData.description}
                onChange={(e) => handleComplaintInputChange('description', e.target.value)}
                placeholder="Provide detailed description of the issue..."
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComplaintDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitComplaint} 
            variant="contained"
            color="error"
            startIcon={<ReportIcon />}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
        </>
      ) : (
        // Attendance Form View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ScheduleIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                {editingAttendance ? 'Edit Attendance' : 'Mark New Attendance'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCloseDialog}
              sx={{ minWidth: 120 }}
            >
              Back to Dashboard
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

          {/* Attendance Form */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={formData.classId}
                    label="Class"
                    onChange={(e) => handleClassChange(e.target.value)}
                    required
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>{cls.name} ({cls.code})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Student Attendance Table */}
          {studentAttendance.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Student Attendance
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentAttendance.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {student.studentId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {student.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant={student.status === 'present' ? 'contained' : 'outlined'}
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleStudentStatusChange(student.id, 'present')}
                            >
                              Present
                            </Button>
                            <Button
                              size="small"
                              variant={student.status === 'absent' ? 'contained' : 'outlined'}
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleStudentStatusChange(student.id, 'absent')}
                            >
                              Absent
                            </Button>
                            <Button
                              size="small"
                              variant={student.status === 'late' ? 'contained' : 'outlined'}
                              color="warning"
                              startIcon={<WarningIcon />}
                              onClick={() => handleStudentStatusChange(student.id, 'late')}
                            >
                              Late
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip 
                              label={student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                              size="small"
                              color={
                                student.status === 'present' ? 'success' : 
                                student.status === 'absent' ? 'error' : 'warning'
                              }
                            />
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<ReportIcon />}
                              onClick={() => handleOpenComplaintDialog(student)}
                              sx={{ minWidth: 'auto', px: 1 }}
                            >
                              Report
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Summary:</strong> Present: {studentAttendance.filter(s => s.status === 'present').length} | 
                    Absent: {studentAttendance.filter(s => s.status === 'absent').length} | 
                    Late: {studentAttendance.filter(s => s.status === 'late').length}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<ReportIcon />}
                    onClick={() => {
                      // Open complaint dialog for the first absent/late student
                      const problematicStudent = studentAttendance.find(s => s.status === 'absent' || s.status === 'late');
                      if (problematicStudent) {
                        handleOpenComplaintDialog(problematicStudent);
                      }
                    }}
                    disabled={!studentAttendance.some(s => s.status === 'absent' || s.status === 'late')}
                  >
                    Quick Report
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={studentAttendance.length === 0}
            >
              {editingAttendance ? 'Update' : 'Mark'} Attendance
            </Button>
          </Box>
        </>
      )}

      {/* Complaint Dialog */}
      <Dialog open={openComplaintDialog} onClose={handleCloseComplaintDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportIcon color="error" />
            <Typography variant="h6">
              Report Student Issue
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                value={complaintData.studentName}
                InputProps={{ readOnly: true }}
                sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                value={complaintData.studentId}
                InputProps={{ readOnly: true }}
                sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class"
                value={complaintData.className}
                InputProps={{ readOnly: true }}
                sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={complaintData.date}
                onChange={(e) => handleComplaintInputChange('date', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Issue Type</InputLabel>
                <Select
                  value={complaintData.complaintType}
                  label="Issue Type"
                  onChange={(e) => handleComplaintInputChange('complaintType', e.target.value)}
                  required
                >
                  {complaintTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={complaintData.severity}
                  label="Severity"
                  onChange={(e) => handleComplaintInputChange('severity', e.target.value)}
                  required
                >
                  {severityLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={complaintData.description}
                onChange={(e) => handleComplaintInputChange('description', e.target.value)}
                placeholder="Provide detailed description of the issue..."
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComplaintDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitComplaint} 
            variant="contained"
            color="error"
            startIcon={<ReportIcon />}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { FacultyAttendance };
