import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../../components/shared/StatsCard';

export const PrincipalDashboard = () => {
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalFaculty: 0,
    totalStudents: 0,
    pendingComplaints: 0,
    totalClasses: 0,
    averageAttendance: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [departmentOverview, setDepartmentOverview] = useState([]);
  
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for Principal management
    setStats({
      totalDepartments: 5,
      totalFaculty: 28,
      totalStudents: 450,
      pendingComplaints: 12,
      totalClasses: 85,
      averageAttendance: 87.5,
    });

    setRecentActivities([
      {
        id: 1,
        type: 'complaint',
        title: 'New complaint submitted',
        description: 'Student complaint about lab equipment',
        timestamp: '2 hours ago',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 2,
        type: 'attendance',
        title: 'Attendance report generated',
        description: 'Monthly attendance report for Computer Science',
        timestamp: '4 hours ago',
        status: 'completed'
      },
      {
        id: 3,
        type: 'faculty',
        title: 'New faculty member added',
        description: 'Dr. Sarah Wilson joined Mathematics Department',
        timestamp: '1 day ago',
        status: 'completed'
      },
      {
        id: 4,
        type: 'department',
        title: 'Department capacity updated',
        description: 'Computer Science department capacity increased to 150',
        timestamp: '2 days ago',
        status: 'completed'
      }
    ]);

    setDepartmentOverview([
      {
        id: 1,
        name: 'Computer Science',
        facultyCount: 8,
        studentCount: 120,
        attendance: 92.5,
        complaints: 3,
        department_code: 'CS',
        status: 'active'
      },
      {
        id: 2,
        name: 'Electrical Engineering',
        facultyCount: 6,
        studentCount: 95,
        attendance: 88.7,
        complaints: 2,
        department_code: 'EE',
        status: 'active'
      },
      {
        id: 3,
        name: 'Mechanical Engineering',
        facultyCount: 7,
        studentCount: 110,
        attendance: 85.2,
        complaints: 4,
        department_code: 'ME',
        status: 'active'
      },
      {
        id: 4,
        name: 'Mathematics',
        facultyCount: 4,
        studentCount: 75,
        attendance: 90.1,
        complaints: 1,
        department_code: 'MATH',
        status: 'active'
      },
      {
        id: 5,
        name: 'Physics',
        facultyCount: 3,
        studentCount: 50,
        attendance: 87.8,
        complaints: 2,
        department_code: 'PHY',
        status: 'active'
      }
    ]);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'complaint': return <AssignmentIcon color="warning" />;
      case 'attendance': return <TrendingUpIcon color="info" />;
      case 'faculty': return <PeopleIcon color="success" />;
      case 'department': return <BusinessIcon color="primary" />;
      default: return <InfoIcon />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      default: return 'default';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  const handleManageDepartments = () => {
    navigate('/principal/management');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.first_name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your college's performance and recent activities.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Departments"
            value={stats.totalDepartments}
            icon={BusinessIcon}
            color="primary"
            tooltip="Total number of academic departments"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Faculty"
            value={stats.totalFaculty}
            icon={PeopleIcon}
            color="success"
            tooltip="Total number of faculty members"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={SchoolIcon}
            color="info"
            tooltip="Total number of enrolled students"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Pending Complaints"
            value={stats.pendingComplaints}
            icon={AssignmentIcon}
            color="warning"
            tooltip="Number of complaints awaiting resolution"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={ScheduleIcon}
            color="secondary"
            tooltip="Total number of active classes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Avg Attendance %"
            value={`${stats.averageAttendance}%`}
            icon={TrendingUpIcon}
            color="success"
            tooltip="Average attendance percentage across all classes"
          />
        </Grid>
      </Grid>

      {/* Department Overview and Recent Activities */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Department Overview</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleManageDepartments}
                >
                  Manage All
                </Button>
              </Box>
              
              <List sx={{ p: 0 }}>
                {departmentOverview.map((dept, index) => (
                  <React.Fragment key={dept.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <BusinessIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="subtitle2">{dept.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Code: {dept.department_code}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${dept.attendance}%`}
                              size="small"
                              color={getAttendanceColor(dept.attendance)}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Faculty: {dept.facultyCount} | Students: {dept.studentCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pending complaints: {dept.complaints}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < departmentOverview.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activities</Typography>
              
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">
                              {activity.title}
                            </Typography>
                            <Chip
                              label={activity.status}
                              size="small"
                              color={getActivityColor(activity.status)}
                            />
                            {activity.priority && (
                              <Chip
                                label={activity.priority}
                                size="small"
                                color={activity.priority === 'high' ? 'error' : activity.priority === 'medium' ? 'warning' : 'success'}
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions - Principal Management Only */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Principal Management Actions</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<BusinessIcon />}
                  onClick={handleManageDepartments}
                >
                  Manage Departments
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PeopleIcon />}
                  onClick={() => navigate('/principal/management')}
                >
                  Manage Faculty
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AssignmentIcon />}
                  onClick={() => navigate('/principal/management')}
                >
                  View Complaints
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TrendingUpIcon />}
                  onClick={() => navigate('/principal/management')}
                >
                  View Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
