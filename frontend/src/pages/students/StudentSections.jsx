import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Book as BookIcon,
} from '@mui/icons-material';

const StudentSections = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock section data - replace with actual API calls
  const sections = [
    {
      id: 1,
      name: 'Computer Science Section A',
      code: 'CS-A-2024',
      department: 'Computer Science',
      semester: 1,
      year: '2024-2025',
      capacity: 30,
      enrolled: 28,
      advisor: 'Dr. Smith',
      advisorEmail: 'dr.smith@college.edu',
      schedule: [
        { day: 'Monday', time: '09:00-10:00', subject: 'CS101', room: 'Lab 101' },
        { day: 'Wednesday', time: '09:00-10:00', subject: 'CS101', room: 'Lab 101' },
        { day: 'Friday', time: '09:00-10:00', subject: 'CS101', room: 'Lab 101' },
      ],
      classmates: [
        { id: 1, name: 'John Doe', email: 'john.doe@college.edu', avatar: 'JD' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@college.edu', avatar: 'JS' },
        { id: 3, name: 'Mike Johnson', email: 'mike.johnson@college.edu', avatar: 'MJ' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@college.edu', avatar: 'SW' },
        { id: 5, name: 'David Brown', email: 'david.brown@college.edu', avatar: 'DB' },
      ],
      subjects: [
        { code: 'CS101', name: 'Introduction to Computer Science', credits: 4 },
        { code: 'MATH201', name: 'Calculus I', credits: 3 },
        { code: 'ENG101', name: 'English Composition', credits: 3 },
        { code: 'PHY101', name: 'Physics I', credits: 4 },
      ],
    },
    {
      id: 2,
      name: 'Mathematics Section B',
      code: 'MATH-B-2024',
      department: 'Mathematics',
      semester: 1,
      year: '2024-2025',
      capacity: 25,
      enrolled: 25,
      advisor: 'Prof. Johnson',
      advisorEmail: 'prof.johnson@college.edu',
      schedule: [
        { day: 'Tuesday', time: '10:00-11:30', subject: 'MATH201', room: 'Room 205' },
        { day: 'Thursday', time: '10:00-11:30', subject: 'MATH201', room: 'Room 205' },
      ],
      classmates: [
        { id: 6, name: 'Alex Chen', email: 'alex.chen@college.edu', avatar: 'AC' },
        { id: 7, name: 'Emily Davis', email: 'emily.davis@college.edu', avatar: 'ED' },
        { id: 8, name: 'Ryan Miller', email: 'ryan.miller@college.edu', avatar: 'RM' },
      ],
      subjects: [
        { code: 'MATH201', name: 'Calculus I', credits: 3 },
        { code: 'MATH202', name: 'Calculus II', credits: 3 },
      ],
    },
  ];

  const getStatusColor = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <GroupIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          My Sections
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {sections.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Sections
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {sections.reduce((sum, s) => sum + s.subjects.length, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Subjects
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {sections.reduce((sum, s) => sum + s.enrolled, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Classmates
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {sections.reduce((sum, s) => sum + s.subjects.reduce((subSum, sub) => subSum + sub.credits, 0), 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Credits
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Sections Grid */}
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} key={section.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {section.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {section.code} • {section.department} • Semester {section.semester} • {section.year}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`${section.enrolled}/${section.capacity}`} 
                      size="small" 
                      color={getStatusColor(section.enrolled, section.capacity)}
                    />
                    <Chip 
                      label={`${Math.round((section.enrolled / section.capacity) * 100)}% Full`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* Section Details */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon color="primary" />
                      Section Details
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Advisor:</strong> {section.advisor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Email:</strong> {section.advisorEmail}
                      </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Subjects ({section.subjects.length})
                    </Typography>
                    <List dense>
                      {section.subjects.map((subject, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={subject.name}
                            secondary={`${subject.code} • ${subject.credits} Credits`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {/* Schedule */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon color="primary" />
                      Schedule
                    </Typography>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Day</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Room</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {section.schedule.map((schedule, index) => (
                            <TableRow key={index}>
                              <TableCell>{schedule.day}</TableCell>
                              <TableCell>{schedule.time}</TableCell>
                              <TableCell>{schedule.subject}</TableCell>
                              <TableCell>{schedule.room}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Classmates */}
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon color="primary" />
                  Classmates ({section.classmates.length})
                </Typography>
                
                <Grid container spacing={2}>
                  {section.classmates.map((classmate) => (
                    <Grid item xs={12} sm={6} md={4} key={classmate.id}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}>
                            {classmate.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {classmate.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {classmate.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export { StudentSections };
