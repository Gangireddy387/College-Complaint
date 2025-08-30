import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState({
    totalClasses: 45,
    attendedClasses: 42,
    attendancePercentage: 93.3,
    subjects: [
      { name: 'Computer Science', attended: 15, total: 16, percentage: 93.8 },
      { name: 'Mathematics', attended: 14, total: 15, percentage: 93.3 },
      { name: 'Physics', attended: 13, total: 14, percentage: 92.9 },
    ]
  });

  const [recentComplaints, setRecentComplaints] = useState([
    {
      id: 1,
      subject: 'Infrastructure Issue',
      description: 'Air conditioning not working in Computer Lab',
      status: 'pending',
      submittedDate: '2024-01-15',
      priority: 'medium'
    },
    {
      id: 2,
      subject: 'Academic Concern',
      description: 'Need clarification on assignment submission deadline',
      status: 'resolved',
      submittedDate: '2024-01-10',
      priority: 'low'
    }
  ]);

  const [upcomingClasses, setUpcomingClasses] = useState([
    {
      id: 1,
      subject: 'Computer Science',
      faculty: 'Prof. Jane Smith',
      time: '09:00 AM',
      room: 'Lab 101',
      date: '2024-01-20'
    },
    {
      id: 2,
      subject: 'Mathematics',
      faculty: 'Prof. Robert Johnson',
      time: '11:00 AM',
      room: 'Room 205',
      date: '2024-01-20'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your academic journey today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Section Overview */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h5">
                  My Section: {user?.section_id || 'A'} - Computer Science
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Academic Year: 2024-2025 | Semester: {user?.semester || 3} | Section Advisor: Prof. Jane Smith
              </Typography>
              <Typography variant="body2">
                You are enrolled in this section with 28 other students. All your classes, attendance, and academic activities are managed within this section.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Roll Number: {user?.rollNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Department: Computer Science
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Student ID: {user?.student_id || 'CS001'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  sx={{ mr: 1 }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => navigate('/student/profile')}
                >
                  View Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Attendance Summary</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {attendanceData.attendancePercentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall Attendance
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {attendanceData.attendedClasses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Classes Attended
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="text.secondary">
                      {attendanceData.totalClasses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Classes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Subject-wise Attendance
              </Typography>
              
              {attendanceData.subjects.map((subject, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{subject.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subject.attended}/{subject.total} ({subject.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={subject.percentage}
                    color={getAttendanceColor(subject.percentage)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Complaints */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Recent Complaints</Typography>
                </Box>
                <Button size="small" variant="outlined">
                  View All
                </Button>
              </Box>
              
              <List sx={{ p: 0 }}>
                {recentComplaints.map((complaint, index) => (
                  <React.Fragment key={complaint.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {complaint.status === 'resolved' ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">
                              {complaint.subject}
                            </Typography>
                            <Chip
                              label={complaint.status}
                              size="small"
                              color={getStatusColor(complaint.status)}
                            />
                            <Chip
                              label={complaint.priority}
                              size="small"
                              color={getPriorityColor(complaint.priority)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {complaint.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Submitted: {complaint.submittedDate}
                            </Typography>
                          </Box>
                        }
                      />
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                    {index < recentComplaints.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>



        {/* Upcoming Classes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Today's Classes</Typography>
              </Box>
              
              <List sx={{ p: 0 }}>
                {upcomingClasses.map((classItem, index) => (
                  <React.Fragment key={classItem.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <SchoolIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {classItem.subject}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {classItem.faculty}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {classItem.time} • Room {classItem.room}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={classItem.time}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </ListItem>
                    {index < upcomingClasses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="outlined" size="small">
                  View Full Schedule
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions for Section {user?.section_id || 'A'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AssignmentIcon />}
                size="medium"
              >
                Submit New Complaint
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                size="medium"
              >
                View My Attendance
              </Button>
              <Button
                variant="outlined"
                startIcon={<SchoolIcon />}
                size="medium"
              >
                Section Timetable
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                size="medium"
                onClick={() => navigate('/student/profile')}
              >
                View My Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
