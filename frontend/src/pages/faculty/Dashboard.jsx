import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Class as ClassIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { facultyService } from '../../services/faculty.service';
import { StatsCard } from '../../components/shared/StatsCard';
import { PageHeader } from '../../components/shared/PageHeader';

export const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingComplaints: 0,
    todayClasses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [classes, complaints] = await Promise.all([
          facultyService.getClasses(user.id),
          facultyService.getComplaints(user.id, { status: 'pending' }),
        ]);

        const totalClasses = classes.data?.length || 0;
        const totalStudents = classes.data?.reduce((sum, cls) => sum + (cls.students?.length || 0), 0) || 0;
        const today = new Date().toISOString().split('T')[0];
        const todayClasses = classes.data?.filter(cls => 
          cls.schedule?.some(sch => sch.day === new Date().getDay())
        ).length || 0;

        setStats({
          totalClasses,
          totalStudents,
          pendingComplaints: complaints.data?.length || 0,
          todayClasses,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Faculty Dashboard"
        subtitle={`Welcome back, ${user?.firstName} ${user?.lastName}`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
        ]}
        action
        actionLabel="Mark Attendance"
        onActionClick={() => {/* Navigate to attendance page */}}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={ClassIcon}
            color="primary"
            tooltip="Total number of classes you teach"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={PeopleIcon}
            color="success"
            tooltip="Total number of students in your classes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Complaints"
            value={stats.pendingComplaints}
            icon={AssignmentIcon}
            color="warning"
            tooltip="Number of complaints awaiting your response"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Today's Classes"
            value={stats.todayClasses}
            icon={ScheduleIcon}
            color="info"
            tooltip="Number of classes scheduled for today"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Schedule
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your class schedule for today will be displayed here
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Complaints
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent complaints that need your attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
