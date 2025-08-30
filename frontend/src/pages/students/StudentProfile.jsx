import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-profile-tabpanel-${index}`}
      aria-labelledby={`student-profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const StudentProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  // Mock student data - replace with actual API calls
  const [student] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@college.edu',
    phone: '+1 (555) 123-4567',
    student_id: 'STU001',
    department: 'Computer Science',
    semester: 3,
    cgpa: 8.5,
    avatar: 'JD',
    address: '123 Main Street, New York, NY 10001',
    date_of_birth: '2000-05-15',
    joining_date: '2022-09-01',
    academic_history: [
      {
        year: '2022-2023',
        semester: 1,
        cgpa: 8.2,
        subjects: ['Introduction to Programming', 'Mathematics', 'Physics']
      },
      {
        year: '2022-2023',
        semester: 2,
        cgpa: 8.7,
        subjects: ['Data Structures', 'Calculus', 'Chemistry']
      },
      {
        year: '2023-2024',
        semester: 1,
        cgpa: 8.5,
        subjects: ['Algorithms', 'Database Systems', 'Computer Networks']
      }
    ],
    attendance: {
      total_classes: 120,
      present: 108,
      absent: 8,
      late: 4,
      percentage: 90.0
    },
    achievements: [
      {
        title: 'Dean\'s List',
        year: 2023,
        description: 'Academic excellence award'
      },
      {
        title: 'Best Project Award',
        year: 2023,
        description: 'Outstanding project in Database Systems'
      },
      {
        title: 'Programming Competition Winner',
        year: 2022,
        description: 'First place in college programming contest'
      }
    ],
    skills: ['Java', 'Python', 'JavaScript', 'SQL', 'React', 'Node.js'],
    languages: ['English', 'Spanish'],
    hobbies: ['Reading', 'Programming', 'Gaming', 'Traveling']
  });

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'warning';
    return 'error';
  };

  const getCGPAColor = (cgpa) => {
    if (cgpa >= 8.5) return 'success';
    if (cgpa >= 7.0) return 'warning';
    return 'error';
  };

  // Convert academic history data for ResponsiveTable
  const academicHistoryColumns = [
    {
      field: 'year',
      headerName: 'Academic Year',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'semester',
      headerName: 'Semester',
      render: (value) => `Semester ${value}`,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'cgpa',
      headerName: 'CGPA',
      render: (value) => (
        <Chip
          label={value}
          size="small"
          color={value >= 8.5 ? 'success' : value >= 7.0 ? 'warning' : 'error'}
          variant="filled"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'subjects',
      headerName: 'Subjects',
      render: (value) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {value.map((subject, idx) => (
            <Chip
              key={idx}
              label={subject}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      ),
      hideOnMobile: true,
      hideOnTablet: false,
    },
  ];

  const handleAcademicHistoryRowClick = (record) => {
    console.log('Academic record clicked:', record);
    // Show detailed academic record
  };

  const expandableAcademicContent = (record) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Academic Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Academic Year:</strong> {record.year}
          </Typography>
          <Typography variant="body2">
            <strong>Semester:</strong> {record.semester}
          </Typography>
          <Typography variant="body2">
            <strong>CGPA:</strong> {record.cgpa}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Performance:</strong> {
              record.cgpa >= 8.5 ? 'Excellent' :
              record.cgpa >= 7.0 ? 'Good' : 'Needs Improvement'
            }
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Subjects Enrolled:</strong>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {record.subjects.map((subject, idx) => (
            <Chip key={idx} label={subject} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Student Profile
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            size={isMobile ? "small" : "medium"}
          >
            Edit Profile
          </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          View and manage student information, academic records, and achievements.
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
          Resize your browser window to see the profile data transform into different layouts!
        </Typography>
      </Alert>

      {/* Student Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '2rem',
                    bgcolor: theme.palette.primary.main,
                    mb: 2,
                  }}
                >
                  {student.avatar}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {student.name}
                </Typography>
                <Chip
                  label={`CGPA: ${student.cgpa}`}
                  color={getCGPAColor(student.cgpa)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {student.department}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{student.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{student.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SchoolIcon fontSize="small" color="action" />
                    <Typography variant="body2">Student ID: {student.student_id}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">Semester {student.semester}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">{student.address}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">DOB: {student.date_of_birth}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="Academic History" />
          <Tab label="Attendance" />
          <Tab label="Achievements" />
          <Tab label="Skills & Interests" />
        </Tabs>

        {/* Academic History Tab */}
        <TabPanel value={tabValue} index={0}>
          <ResponsiveTable
            columns={academicHistoryColumns}
            data={student.academic_history}
            onRowClick={handleAcademicHistoryRowClick}
            expandable={true}
            expandableContent={expandableAcademicContent}
            emptyMessage="No academic history found"
          />
        </TabPanel>

        {/* Attendance Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Attendance Statistics" avatar={<TimelineIcon />} />
                <CardContent>
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
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Attendance Rate" avatar={<TimelineIcon />} />
                <CardContent>
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Achievements Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            {student.achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <EmojiEventsIcon color="primary" />
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.year}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2">
                      {achievement.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Skills & Interests Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Skills" avatar={<SchoolIcon />} />
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {student.skills.map((skill, index) => (
                      <Chip key={index} label={skill} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Languages" avatar={<PersonIcon />} />
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {student.languages.map((language, index) => (
                      <Chip key={index} label={language} color="secondary" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Hobbies & Interests" avatar={<PersonIcon />} />
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {student.hobbies.map((hobby, index) => (
                      <Chip key={index} label={hobby} color="info" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};
