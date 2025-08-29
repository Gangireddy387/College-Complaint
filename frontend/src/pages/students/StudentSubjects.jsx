import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  Book as BookIcon,
} from '@mui/icons-material';

const StudentSubjects = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock subjects data - replace with actual API calls
  const subjects = [
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Computer Science',
      credits: 4,
      teacher: 'Dr. Smith',
      teacherAvatar: 'DS',
      semester: 1,
      grade: 'A',
      progress: 85,
      description: 'Fundamental concepts of computer science and programming',
      schedule: 'Mon, Wed, Fri 09:00-10:00',
      room: 'Lab 101',
      type: 'Core',
      status: 'Active',
    },
    {
      id: 2,
      code: 'MATH201',
      name: 'Calculus I',
      credits: 3,
      teacher: 'Prof. Johnson',
      teacherAvatar: 'PJ',
      semester: 1,
      grade: 'A-',
      progress: 92,
      description: 'Differential calculus and its applications',
      schedule: 'Tue, Thu 10:00-11:30',
      room: 'Room 205',
      type: 'Core',
      status: 'Active',
    },
    {
      id: 3,
      code: 'ENG101',
      name: 'English Composition',
      credits: 3,
      teacher: 'Ms. Davis',
      teacherAvatar: 'MD',
      semester: 1,
      grade: 'B+',
      progress: 78,
      description: 'Academic writing and communication skills',
      schedule: 'Mon, Wed 14:00-15:30',
      room: 'Room 103',
      type: 'General',
      status: 'Active',
    },
    {
      id: 4,
      code: 'PHY101',
      name: 'Physics I',
      credits: 4,
      teacher: 'Dr. Wilson',
      teacherAvatar: 'DW',
      semester: 1,
      grade: 'B',
      progress: 72,
      description: 'Mechanics, thermodynamics, and wave motion',
      schedule: 'Tue, Thu 14:00-16:00',
      room: 'Lab 202',
      type: 'Core',
      status: 'Active',
    },
    {
      id: 5,
      code: 'CS102',
      name: 'Data Structures',
      credits: 4,
      teacher: 'Dr. Brown',
      teacherAvatar: 'DB',
      semester: 2,
      grade: 'N/A',
      progress: 0,
      description: 'Advanced data structures and algorithms',
      schedule: 'Mon, Wed, Fri 11:00-12:00',
      room: 'Lab 101',
      type: 'Core',
      status: 'Upcoming',
    },
  ];

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'success';
      case 'A-': return 'success';
      case 'B+': return 'info';
      case 'B': return 'info';
      case 'B-': return 'warning';
      case 'C+': return 'warning';
      case 'C': return 'warning';
      case 'D': return 'error';
      case 'F': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Core': return 'primary';
      case 'General': return 'secondary';
      case 'Elective': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'info';
      case 'Completed': return 'default';
      default: return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'success';
    if (progress >= 80) return 'info';
    if (progress >= 70) return 'warning';
    return 'error';
  };

  const totalCredits = subjects.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.credits, 0);
  const completedCredits = subjects.filter(s => s.grade !== 'N/A').reduce((sum, s) => sum + s.credits, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          My Subjects
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {subjects.filter(s => s.status === 'Active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Subjects
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {totalCredits}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Credits
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {completedCredits}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed Credits
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {subjects.filter(s => s.grade === 'A' || s.grade === 'A-').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A Grades
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Subjects Grid */}
      <Grid container spacing={3}>
        {subjects.map((subject) => (
          <Grid item xs={12} md={6} key={subject.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {subject.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {subject.code} • {subject.credits} Credits
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={subject.type} 
                      size="small" 
                      color={getTypeColor(subject.type)}
                      variant="outlined"
                    />
                    <Chip 
                      label={subject.status} 
                      size="small" 
                      color={getStatusColor(subject.status)}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {subject.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                    {subject.teacherAvatar}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {subject.teacher}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Instructor
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {subject.schedule}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <BookIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {subject.room}
                  </Typography>
                </Box>

                {subject.grade !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <GradeIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium">
                      Grade: <Chip label={subject.grade} size="small" color={getGradeColor(subject.grade)} />
                    </Typography>
                  </Box>
                )}

                {subject.status === 'Active' && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {subject.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={subject.progress} 
                      color={getProgressColor(subject.progress)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export { StudentSubjects };
