import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Box as MuiBox,
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Grade as GradeIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Home as HomeIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { StudentForm } from '../../components/forms';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data - replace with actual API calls
const mockStudent = {
  id: 1,
  student_id: 'STU001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@college.edu',
  department: { id: 1, name: 'Computer Science' },
  semester: 3,
  phone_number: '9876543210',
  date_of_birth: '2000-05-15',
  gender: 'male',
  status: 'active',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    pincode: '10001'
  },
  guardian_info: {
    name: 'Robert Doe',
    phone: '9876543211',
    relationship: 'Father',
    email: 'robert.doe@email.com'
  },
  academic_history: [
    { year: '2022-2023', semester: 1, cgpa: 8.5, subjects: ['Data Structures', 'Algorithms', 'Database'] },
    { year: '2022-2023', semester: 2, cgpa: 8.7, subjects: ['Web Development', 'Machine Learning', 'Networks'] },
    { year: '2023-2024', semester: 1, cgpa: 8.9, subjects: ['Software Engineering', 'AI', 'Cloud Computing'] }
  ],
  achievements: [
    { title: 'Dean\'s List', year: 2023, description: 'Academic Excellence - Top 10% of class' },
    { title: 'Best Project Award', year: 2023, description: 'Outstanding final year project' },
    { title: 'Hackathon Winner', year: 2022, description: 'First place in college hackathon' }
  ],
  attendance: {
    total_classes: 120,
    present: 108,
    absent: 8,
    late: 4,
    percentage: 90.0
  },
  complaints: [
    { id: 1, type: 'late_arrival', date: '2023-10-15', status: 'resolved', severity: 'low' },
    { id: 2, type: 'disturbance', date: '2023-09-20', status: 'pending', severity: 'medium' }
  ]
};

const mockTimeSlots = [
  { id: 1, day: 'Monday', start_time: '09:00', end_time: '10:00', subject: 'Data Structures', faculty: 'Dr. Smith' },
  { id: 2, day: 'Monday', start_time: '10:15', end_time: '11:15', subject: 'Algorithms', faculty: 'Dr. Johnson' },
  { id: 3, day: 'Tuesday', start_time: '09:00', end_time: '10:00', subject: 'Database Systems', faculty: 'Dr. Brown' },
  { id: 4, day: 'Wednesday', start_time: '14:00', end_time: '15:00', subject: 'Web Development', faculty: 'Dr. Davis' }
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(mockStudent);
  const [tabValue, setTabValue] = useState(0);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch student data based on ID
    // setLoading(true);
    // fetchStudent(id).then(data => {
    //   setStudent(data);
    //   setLoading(false);
    // });
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setOpenEditForm(true);
  };

  const handleFormSubmit = (values) => {
    setStudent({ ...student, ...values });
    setOpenEditForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'alumni': return 'info';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getGenderIcon = (gender) => {
    return gender === 'male' ? '👨' : gender === 'female' ? '👩' : '👤';
  };

  const getComplaintTypeLabel = (type) => {
    const labels = {
      late_arrival: 'Late Arrival',
      disturbance: 'Disturbance',
      misbehavior: 'Misbehavior',
      unauthorized_device_usage: 'Unauthorized Device Usage',
      inappropriate_conduct: 'Inappropriate Conduct',
      academic_dishonesty: 'Academic Dishonesty',
      bullying: 'Bullying',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getComplaintSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getComplaintStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      case 'resolved': return 'success';
      case 'dismissed': return 'default';
      default: return 'default';
    }
  };

  const calculateOverallCGPA = () => {
    if (!student.academic_history || student.academic_history.length === 0) return 0;
    const totalCGPA = student.academic_history.reduce((sum, record) => sum + record.cgpa, 0);
    return (totalCGPA / student.academic_history.length).toFixed(2);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading student profile...</Typography>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Student not found</Alert>
        <Button onClick={() => navigate('/students')} sx={{ mt: 2 }}>
          Back to Students
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
            {getGenderIcon(student.gender)}
          </Avatar>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {student.first_name} {student.last_name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {student.student_id} • {student.department.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={student.status}
                color={getStatusColor(student.status)}
                size="small"
              />
              <Chip
                label={`Semester ${student.semester}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`CGPA: ${calculateOverallCGPA()}`}
                color="secondary"
                variant="outlined"
                size="small"
                icon={<GradeIcon />}
              />
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {calculateOverallCGPA()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall CGPA
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main" gutterBottom>
                {student.attendance.percentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main" gutterBottom>
                {student.academic_history.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Semesters Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {student.achievements.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Achievements
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="student profile tabs">
          <Tab label="Overview" />
          <Tab label="Academic History" />
          <Tab label="Attendance" />
          <Tab label="Achievements" />
          <Tab label="Complaints" />
          <Tab label="Schedule" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Personal Information" avatar={<PersonIcon />} />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><EmailIcon /></ListItemIcon>
                      <ListItemText primary="Email" secondary={student.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText primary="Phone" secondary={student.phone_number} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CakeIcon /></ListItemIcon>
                      <ListItemText primary="Date of Birth" secondary={student.date_of_birth} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      <ListItemText primary="Gender" secondary={student.gender} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Address Information" avatar={<LocationIcon />} />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    <strong>Street:</strong> {student.address.street}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>City:</strong> {student.address.city}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>State:</strong> {student.address.state}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Pincode:</strong> {student.address.pincode}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Guardian Information */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Guardian Information" avatar={<PersonIcon />} />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Name:</strong> {student.guardian_info.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Phone:</strong> {student.guardian_info.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Relationship:</strong> {student.guardian_info.relationship}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Email:</strong> {student.guardian_info.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Academic History Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardHeader title="Academic History" avatar={<SchoolIcon />} />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Academic Year</TableCell>
                      <TableCell>Semester</TableCell>
                      <TableCell>CGPA</TableCell>
                      <TableCell>Subjects</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student.academic_history.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.year}</TableCell>
                        <TableCell>Semester {record.semester}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.cgpa}
                            color={record.cgpa >= 8.5 ? 'success' : record.cgpa >= 7.0 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {record.subjects.map((subject, idx) => (
                              <Chip
                                key={idx}
                                label={subject}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Attendance Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardHeader title="Attendance Overview" avatar={<TimelineIcon />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Attendance Statistics</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Total Classes: {student.attendance.total_classes}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Present: {student.attendance.present}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Absent: {student.attendance.absent}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Late: {student.attendance.late}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Attendance Rate</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={student.attendance.percentage}
                        color={getProgressColor(student.attendance.percentage)}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="h6" color="primary">
                      {student.attendance.percentage}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Achievements Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardHeader title="Achievements & Awards" avatar={<TrophyIcon />} />
            <CardContent>
              <Grid container spacing={2}>
                {student.achievements.map((achievement, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {achievement.year}
                        </Typography>
                        <Typography variant="body2">
                          {achievement.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Complaints Tab */}
        <TabPanel value={tabValue} index={4}>
          <Card>
            <CardHeader title="Disciplinary Record" avatar={<WorkIcon />} />
            <CardContent>
              {student.complaints.length === 0 ? (
                <Alert severity="info">No disciplinary complaints on record.</Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Severity</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {student.complaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>{complaint.date}</TableCell>
                          <TableCell>{getComplaintTypeLabel(complaint.type)}</TableCell>
                          <TableCell>
                            <Chip
                              label={complaint.severity}
                              color={getComplaintSeverityColor(complaint.severity)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={complaint.status}
                              color={getComplaintStatusColor(complaint.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Schedule Tab */}
        <TabPanel value={tabValue} index={5}>
          <Card>
            <CardHeader title="Class Schedule" avatar={<SchoolIcon />} />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Faculty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockTimeSlots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>{slot.day}</TableCell>
                        <TableCell>{slot.start_time} - {slot.end_time}</TableCell>
                        <TableCell>{slot.subject}</TableCell>
                        <TableCell>{slot.faculty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Edit Form Dialog */}
      <StudentForm
        open={openEditForm}
        onClose={() => setOpenEditForm(false)}
        onSubmit={handleFormSubmit}
        initialValues={student}
        departments={[student.department]}
        sections={[]}
      />
    </Box>
  );
};
