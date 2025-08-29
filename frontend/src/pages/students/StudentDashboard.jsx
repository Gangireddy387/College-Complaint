import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  LinearProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Book as BookIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  ],
  upcoming_classes: [
    { id: 1, day: 'Today', time: '09:00 - 10:00', subject: 'Data Structures', faculty: 'Dr. Smith', room: 'A101' },
    { id: 2, day: 'Today', time: '10:15 - 11:15', subject: 'Algorithms', faculty: 'Dr. Johnson', room: 'A102' },
    { id: 3, day: 'Tomorrow', time: '09:00 - 10:00', subject: 'Database Systems', faculty: 'Dr. Brown', room: 'A103' }
  ],
  recent_assignments: [
    { id: 1, subject: 'Data Structures', title: 'Binary Tree Implementation', due_date: '2023-12-20', status: 'pending' },
    { id: 2, subject: 'Algorithms', title: 'Sorting Algorithm Analysis', due_date: '2023-12-18', status: 'submitted' },
    { id: 3, subject: 'Web Development', title: 'React Portfolio Project', due_date: '2023-12-25', status: 'pending' }
  ],
  notifications: [
    { id: 1, message: 'New assignment posted in Data Structures', time: '2 hours ago', read: false },
    { id: 2, message: 'Attendance marked for today\'s classes', time: '4 hours ago', read: true },
    { id: 3, message: 'Exam schedule updated for Semester 3', time: '1 day ago', read: false }
  ]
};

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(mockStudent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch student data
    // setLoading(true);
    // fetchStudentDashboard().then(data => {
    //   setStudent(data);
    //   setLoading(false);
    // });
  }, []);

  const calculateOverallCGPA = () => {
    if (!student.academic_history || student.academic_history.length === 0) return 0;
    const totalCGPA = student.academic_history.reduce((sum, record) => sum + record.cgpa, 0);
    return (totalCGPA / student.academic_history.length).toFixed(2);
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

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  const getAssignmentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'submitted': return 'success';
      case 'late': return 'error';
      default: return 'default';
    }
  };

  const handleViewProfile = () => {
    navigate(`/students/profile/${student.id}`);
  };

  const handleViewAssignments = () => {
    navigate('/students/assignments');
  };

  const handleViewAttendance = () => {
    navigate('/students/attendance');
  };

  const handleViewSchedule = () => {
    navigate('/students/schedule');
  };

  const handleViewComplaints = () => {
    navigate('/students/complaints');
  };

  const handleMarkNotificationRead = (notificationId) => {
    setStudent(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
  };

  const unreadNotifications = student.notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: '1.5rem' }}>
            {getGenderIcon(student.gender)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {student.first_name}!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {student.student_id} • {student.department.name} • Semester {student.semester}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          <Tooltip title={`${unreadNotifications} unread notifications`}>
            <IconButton color="primary">
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <GradeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="primary">
                    {calculateOverallCGPA()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall CGPA
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
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TimelineIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {student.attendance.percentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Rate
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
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {student.academic_history.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Semesters Completed
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
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrophyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {student.achievements.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Achievements
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Upcoming Classes */}
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Upcoming Classes" 
              avatar={<ScheduleIcon />}
              action={
                <Button size="small" onClick={handleViewSchedule}>
                  View All
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Room</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student.upcoming_classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell>
                          <Chip 
                            label={classItem.day} 
                            color={classItem.day === 'Today' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{classItem.time}</TableCell>
                        <TableCell>{classItem.subject}</TableCell>
                        <TableCell>{classItem.faculty}</TableCell>
                        <TableCell>{classItem.room}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Recent Assignments" 
              avatar={<AssignmentIcon />}
              action={
                <Button size="small" onClick={handleViewAssignments}>
                  View All
                </Button>
              }
            />
            <CardContent>
              <List>
                {student.recent_assignments.map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    <ListItem>
                      <ListItemIcon>
                        <BookIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`${assignment.subject} • Due: ${assignment.due_date}`}
                      />
                      <Chip
                        label={assignment.status}
                        color={getAssignmentStatusColor(assignment.status)}
                        size="small"
                      />
                    </ListItem>
                    {index < student.recent_assignments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card>
            <CardHeader 
              title="Attendance Overview" 
              avatar={<TimelineIcon />}
              action={
                <Button size="small" onClick={handleViewAttendance}>
                  View Details
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Statistics</Typography>
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
                  <Typography variant="h6" gutterBottom>Progress</Typography>
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
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleViewProfile}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="View Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleViewAssignments}>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary="View Assignments" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleViewAttendance}>
                    <ListItemIcon><TimelineIcon /></ListItemIcon>
                    <ListItemText primary="View Attendance" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleViewSchedule}>
                    <ListItemIcon><ScheduleIcon /></ListItemIcon>
                    <ListItemText primary="View Schedule" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleViewComplaints}>
                    <ListItemIcon><WorkIcon /></ListItemIcon>
                    <ListItemText primary="View Complaints" />
                  </ListItemButton>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Recent Notifications" 
              avatar={<NotificationsIcon />}
            />
            <CardContent>
              <List dense>
                {student.notifications.slice(0, 5).map((notification) => (
                  <ListItem key={notification.id} disablePadding>
                    <ListItemButton 
                      onClick={() => handleMarkNotificationRead(notification.id)}
                      sx={{ 
                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        mb: 0.5
                      }}
                    >
                      <ListItemText
                        primary={notification.message}
                        secondary={notification.time}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: notification.read ? 'normal' : 'medium'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Academic Progress */}
          <Card>
            <CardHeader title="Academic Progress" avatar={<TrendingUpIcon />} />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Current Semester: {student.semester}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Department: {student.department.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Status: 
                  <Chip
                    label={student.status}
                    color={getStatusColor(student.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
              
              <Typography variant="h6" gutterBottom>CGPA Trend</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {student.academic_history.slice(-3).map((record, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Sem {record.semester}
                    </Typography>
                    <Chip
                      label={record.cgpa}
                      color={record.cgpa >= 8.5 ? 'success' : record.cgpa >= 7.0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
