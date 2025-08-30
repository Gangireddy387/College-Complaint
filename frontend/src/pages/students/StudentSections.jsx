import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

export const StudentSections = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { user } = useSelector((state) => state.auth);
  const [studentSections, setStudentSections] = useState([]);

  // Mock data for student sections
  useEffect(() => {
    setStudentSections([
      {
        id: 1,
        name: 'Computer Science Section A',
        code: 'CS-A',
        department: 'Computer Science',
        semester: 3,
        year: '2024-2025',
        advisor: 'Dr. John Smith',
        advisorEmail: 'john.smith@college.edu',
        totalStudents: 28,
        maxStudents: 30,
        status: 'Active',
        subjects: [
          { name: 'Data Structures', code: 'CS201', credits: 4 },
          { name: 'Algorithms', code: 'CS202', credits: 4 },
          { name: 'Database Systems', code: 'CS203', credits: 3 },
          { name: 'Web Development', code: 'CS204', credits: 3 },
          { name: 'Computer Networks', code: 'CS205', credits: 3 },
        ],
        schedule: [
          { day: 'Monday', time: '09:00-10:00', subject: 'Data Structures', room: 'Lab 101' },
          { day: 'Monday', time: '10:00-11:00', subject: 'Algorithms', room: 'Lab 102' },
          { day: 'Tuesday', time: '09:00-10:00', subject: 'Database Systems', room: 'Room 205' },
          { day: 'Wednesday', time: '09:00-10:00', subject: 'Web Development', room: 'Lab 103' },
          { day: 'Thursday', time: '09:00-10:00', subject: 'Computer Networks', room: 'Room 206' },
          { day: 'Friday', time: '09:00-10:00', subject: 'Data Structures', room: 'Lab 101' },
        ],
        classmates: [
          { id: 1, name: 'Alice Johnson', email: 'alice.johnson@college.edu', avatar: 'AJ' },
          { id: 2, name: 'Bob Wilson', email: 'bob.wilson@college.edu', avatar: 'BW' },
          { id: 3, name: 'Carol Davis', email: 'carol.davis@college.edu', avatar: 'CD' },
          { id: 4, name: 'David Brown', email: 'david.brown@college.edu', avatar: 'DB' },
          { id: 5, name: 'Eva Garcia', email: 'eva.garcia@college.edu', avatar: 'EG' },
          { id: 6, name: 'Frank Miller', email: 'frank.miller@college.edu', avatar: 'FM' },
        ]
      },
      {
        id: 2,
        name: 'Electrical Engineering Section B',
        code: 'EE-B',
        department: 'Electrical Engineering',
        semester: 2,
        year: '2024-2025',
        advisor: 'Dr. Sarah Johnson',
        advisorEmail: 'sarah.johnson@college.edu',
        totalStudents: 25,
        maxStudents: 30,
        status: 'Active',
        subjects: [
          { name: 'Circuit Theory', code: 'EE201', credits: 4 },
          { name: 'Electronics', code: 'EE202', credits: 4 },
          { name: 'Digital Logic', code: 'EE203', credits: 3 },
          { name: 'Power Systems', code: 'EE204', credits: 3 },
          { name: 'Control Systems', code: 'EE205', credits: 3 },
        ],
        schedule: [
          { day: 'Monday', time: '10:00-11:00', subject: 'Circuit Theory', room: 'Lab 201' },
          { day: 'Tuesday', time: '10:00-11:00', subject: 'Electronics', room: 'Lab 202' },
          { day: 'Wednesday', time: '10:00-11:00', subject: 'Digital Logic', room: 'Room 301' },
          { day: 'Thursday', time: '10:00-11:00', subject: 'Power Systems', room: 'Lab 203' },
          { day: 'Friday', time: '10:00-11:00', subject: 'Control Systems', room: 'Room 302' },
        ],
        classmates: [
          { id: 7, name: 'Grace Lee', email: 'grace.lee@college.edu', avatar: 'GL' },
          { id: 8, name: 'Henry Chen', email: 'henry.chen@college.edu', avatar: 'HC' },
          { id: 9, name: 'Ivy Wang', email: 'ivy.wang@college.edu', avatar: 'IW' },
          { id: 10, name: 'Jack Taylor', email: 'jack.taylor@college.edu', avatar: 'JT' },
          { id: 11, name: 'Kate Anderson', email: 'kate.anderson@college.edu', avatar: 'KA' },
        ]
      }
    ]);
  }, []);

  // Convert schedule data for ResponsiveTable
  const scheduleColumns = [
    {
      field: 'day',
      headerName: 'Day',
      bold: true,
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
      field: 'subject',
      headerName: 'Subject',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'room',
      headerName: 'Room',
      hideOnMobile: true,
      hideOnTablet: false,
    },
  ];

  const handleScheduleRowClick = (schedule) => {
    console.log('Schedule clicked:', schedule);
    // Show detailed schedule information
  };

  const expandableScheduleContent = (schedule) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Schedule Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Day:</strong> {schedule.day}
          </Typography>
          <Typography variant="body2">
            <strong>Time:</strong> {schedule.time}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Subject:</strong> {schedule.subject}
          </Typography>
          <Typography variant="body2">
            <strong>Room:</strong> {schedule.room}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          Student Sections
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          View your enrolled sections, schedules, and classmates.
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
          Resize your browser window to see the section data transform into different layouts!
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {studentSections.map((studentSection) => (
          <Grid item xs={12} key={studentSection.id}>
            <Card>
              <CardContent>
                {/* Section Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon color="primary" />
                      {studentSection.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {studentSection.department} • Semester {studentSection.semester} • {studentSection.year}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={studentSection.code} color="primary" size="small" />
                      <Chip 
                        label={studentSection.status} 
                        color={studentSection.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                      <Chip 
                        label={`${studentSection.totalStudents}/${studentSection.maxStudents} Students`} 
                        color="info" 
                        size="small" 
                      />
                    </Box>
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
                        <strong>Advisor:</strong> {studentSection.advisor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Email:</strong> {studentSection.advisorEmail}
                      </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Subjects ({studentSection.subjects.length})
                    </Typography>
                    <List dense>
                      {studentSection.subjects.map((subject, index) => (
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
                    
                    <ResponsiveTable
                      columns={scheduleColumns}
                      data={studentSection.schedule}
                      onRowClick={handleScheduleRowClick}
                      expandable={true}
                      expandableContent={expandableScheduleContent}
                      emptyMessage="No schedule found"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Classmates */}
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon color="primary" />
                  Classmates ({studentSection.classmates.length})
                </Typography>
                
                <Grid container spacing={2}>
                  {studentSection.classmates.map((classmate) => (
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
