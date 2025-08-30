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
  Alert,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  School as SchoolIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Grade as GradeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

const StudentSubjects = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [selectedTab, setSelectedTab] = useState(0);

  // Mock data - replace with actual API calls
  const [subjects] = useState([
    {
      id: 1,
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      faculty: 'Dr. John Smith',
      credits: 4,
      semester: 3,
      schedule: 'Mon, Wed, Fri 09:00-10:00',
      room: 'Lab 101',
      attendance: 85,
      grade: 'A-',
      progress: 75,
      description: 'Advanced data structures and algorithm analysis',
      syllabus: 'Arrays, Linked Lists, Trees, Graphs, Sorting, Searching',
      assignments: 5,
      completed_assignments: 4,
      exams: 2,
      completed_exams: 1,
    },
    {
      id: 2,
      name: 'Database Management Systems',
      code: 'CS301',
      faculty: 'Dr. Sarah Johnson',
      credits: 3,
      semester: 3,
      schedule: 'Tue, Thu 10:15-11:45',
      room: 'Lab 102',
      attendance: 92,
      grade: 'A',
      progress: 60,
      description: 'Database design and management principles',
      syllabus: 'ER Model, SQL, Normalization, Transactions',
      assignments: 4,
      completed_assignments: 3,
      exams: 2,
      completed_exams: 1,
    },
    {
      id: 3,
      name: 'Web Development',
      code: 'CS401',
      faculty: 'Dr. Mike Brown',
      credits: 4,
      semester: 3,
      schedule: 'Mon, Wed 14:00-15:30',
      room: 'Lab 103',
      attendance: 78,
      grade: 'B+',
      progress: 45,
      description: 'Modern web development technologies',
      syllabus: 'HTML, CSS, JavaScript, React, Node.js',
      assignments: 6,
      completed_assignments: 3,
      exams: 1,
      completed_exams: 0,
    },
    {
      id: 4,
      name: 'Computer Networks',
      code: 'CS501',
      faculty: 'Dr. Emily Davis',
      credits: 3,
      semester: 3,
      schedule: 'Fri 13:00-16:00',
      room: 'Lab 104',
      attendance: 88,
      grade: 'A-',
      progress: 30,
      description: 'Network protocols and architecture',
      syllabus: 'OSI Model, TCP/IP, Routing, Security',
      assignments: 3,
      completed_assignments: 1,
      exams: 1,
      completed_exams: 0,
    },
  ]);

  // Convert subjects data for ResponsiveTable
  const subjectColumns = [
    {
      field: 'name',
      headerName: 'Subject Name',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'code',
      headerName: 'Code',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'faculty',
      headerName: 'Faculty',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'credits',
      headerName: 'Credits',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'schedule',
      headerName: 'Schedule',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'room',
      headerName: 'Room',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'attendance',
      headerName: 'Attendance %',
      render: (value) => (
        <Chip
          label={`${value}%`}
          size="small"
          color={value >= 90 ? 'success' : value >= 80 ? 'warning' : 'error'}
          variant="filled"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      render: (value) => (
        <Chip
          label={value}
          size="small"
          color={value?.startsWith('A') ? 'success' : value?.startsWith('B') ? 'warning' : 'error'}
          variant="outlined"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'progress',
      headerName: 'Progress',
      render: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="600">
            {value}%
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={value}
              color={value >= 80 ? 'success' : value >= 60 ? 'warning' : 'error'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        </Box>
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
  ];

  const handleSubjectRowClick = (subject) => {
    console.log('Subject clicked:', subject);
    // Navigate to subject details
  };

  const expandableSubjectContent = (subject) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Subject Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Description:</strong> {subject.description}
          </Typography>
          <Typography variant="body2">
            <strong>Syllabus:</strong> {subject.syllabus}
          </Typography>
          <Typography variant="body2">
            <strong>Schedule:</strong> {subject.schedule}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Assignments:</strong> {subject.completed_assignments}/{subject.assignments} completed
          </Typography>
          <Typography variant="body2">
            <strong>Exams:</strong> {subject.completed_exams}/{subject.exams} completed
          </Typography>
          <Typography variant="body2">
            <strong>Semester:</strong> {subject.semester}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  // Filter subjects based on selected tab
  const getFilteredSubjects = () => {
    if (selectedTab === 1) {
      return subjects.filter(subject => subject.progress >= 80);
    } else if (selectedTab === 2) {
      return subjects.filter(subject => subject.progress >= 60 && subject.progress < 80);
    } else if (selectedTab === 3) {
      return subjects.filter(subject => subject.progress < 60);
    }
    return subjects;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          My Subjects
          </Typography>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          View your enrolled subjects, grades, and progress.
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
            isTablet ? 'Tablet Grid View (2-Column Cards)' :
            'Desktop Table View (Full Table)'
          }
            </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Resize your browser window to see the subjects data transform into different layouts!
            </Typography>
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <BookIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {subjects.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                    Total Subjects
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
                  <GradeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {subjects.filter(s => s.grade?.startsWith('A')).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A Grades
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
                  <ScheduleIcon />
                  </Avatar>
                  <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {Math.round(subjects.reduce((acc, s) => acc + s.attendance, 0) / subjects.length)}%
                    </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Attendance
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
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {subjects.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Faculty Members
                      </Typography>
                    </Box>
                  </Box>
              </CardContent>
            </Card>
          </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="All Subjects" />
          <Tab label="Excellent Progress" />
          <Tab label="Good Progress" />
          <Tab label="Needs Attention" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <ResponsiveTable
            columns={subjectColumns}
            data={getFilteredSubjects()}
            onRowClick={handleSubjectRowClick}
            expandable={true}
            expandableContent={expandableSubjectContent}
            emptyMessage="No subjects found"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentSubjects;
