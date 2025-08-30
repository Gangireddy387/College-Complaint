import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Box as MuiBox,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

// Mock data - replace with actual API calls
const mockAttendanceData = {
  overall: {
    total_classes: 120,
    present: 108,
    absent: 8,
    late: 4,
    percentage: 90.0
  },
  by_subject: [
    {
      subject: 'Data Structures',
      faculty: 'Dr. Smith',
      total: 30,
      present: 28,
      absent: 1,
      late: 1,
      percentage: 93.3
    },
    {
      subject: 'Algorithms',
      faculty: 'Dr. Johnson',
      total: 30,
      present: 27,
      absent: 2,
      late: 1,
      percentage: 90.0
    },
    {
      subject: 'Database Systems',
      faculty: 'Dr. Brown',
      total: 30,
      present: 29,
      absent: 0,
      late: 1,
      percentage: 96.7
    },
    {
      subject: 'Web Development',
      faculty: 'Dr. Davis',
      total: 30,
      present: 24,
      absent: 5,
      late: 1,
      percentage: 80.0
    }
  ],
  daily_records: [
    {
      date: '2023-12-15',
      day: 'Friday',
      subjects: [
        { name: 'Data Structures', status: 'present', time: '09:00', room: 'A101' },
        { name: 'Algorithms', status: 'present', time: '10:15', room: 'A102' },
        { name: 'Database Systems', status: 'present', time: '14:00', room: 'A103' }
      ]
    },
    {
      date: '2023-12-14',
      day: 'Thursday',
      subjects: [
        { name: 'Data Structures', status: 'late', time: '09:00', room: 'A101', late_minutes: 15 },
        { name: 'Algorithms', status: 'present', time: '10:15', room: 'A102' },
        { name: 'Web Development', status: 'absent', time: '14:00', room: 'A104' }
      ]
    },
    {
      date: '2023-12-13',
      day: 'Wednesday',
      subjects: [
        { name: 'Data Structures', status: 'present', time: '09:00', room: 'A101' },
        { name: 'Algorithms', status: 'present', time: '10:15', room: 'A102' },
        { name: 'Database Systems', status: 'present', time: '14:00', room: 'A103' }
      ]
    }
  ],
  monthly_summary: [
    { month: 'December 2023', total: 30, present: 27, absent: 2, late: 1, percentage: 90.0 },
    { month: 'November 2023', total: 30, present: 28, absent: 1, late: 1, percentage: 93.3 },
    { month: 'October 2023', total: 30, present: 29, absent: 0, late: 1, percentage: 96.7 },
    { month: 'September 2023', total: 30, present: 24, absent: 5, late: 1, percentage: 80.0 }
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
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

export const StudentAttendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [monthFilter, setMonthFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      default: return status;
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  const filteredMonthlyData = monthFilter 
    ? attendanceData.monthly_summary.filter(item => item.month === monthFilter)
    : attendanceData.monthly_summary;

  const filteredSubjectData = subjectFilter
    ? attendanceData.by_subject.filter(item => item.subject === subjectFilter)
    : attendanceData.by_subject;

  const filteredDailyData = searchTerm
    ? attendanceData.daily_records.filter(day => 
        day.subjects.some(subject => 
          subject.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : attendanceData.daily_records;

  // Convert subject data for ResponsiveTable
  const subjectColumns = [
    {
      field: 'subject',
      headerName: 'Subject',
      bold: true,
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
      field: 'total',
      headerName: 'Total Classes',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'present',
      headerName: 'Present',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'absent',
      headerName: 'Absent',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'late',
      headerName: 'Late',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'percentage',
      headerName: 'Attendance %',
      render: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="600">
            {value}%
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={value}
              color={getProgressColor(value)}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        </Box>
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
  ];

  // Convert daily records for ResponsiveTable
  const dailyColumns = [
    {
      field: 'name',
      headerName: 'Subject',
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
      field: 'room',
      headerName: 'Room',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (value) => (
        <Chip
          label={getStatusLabel(value)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
  ];

  // Flatten daily records for ResponsiveTable
  const flattenedDailyData = mockAttendanceData.daily_records.flatMap(day => 
    day.subjects.map(subject => ({
      ...subject,
      date: day.date,
      day: day.day,
    }))
  );

  const handleSubjectRowClick = (subject) => {
    console.log('Subject clicked:', subject);
    // Navigate to subject details or show more info
  };

  const handleDailyRowClick = (record) => {
    console.log('Daily record clicked:', record);
    // Show detailed attendance record
  };

  const expandableSubjectContent = (subject) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Detailed Attendance Breakdown
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Total Classes:</strong> {subject.total}
          </Typography>
          <Typography variant="body2">
            <strong>Present:</strong> {subject.present} ({((subject.present / subject.total) * 100).toFixed(1)}%)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Absent:</strong> {subject.absent} ({((subject.absent / subject.total) * 100).toFixed(1)}%)
          </Typography>
          <Typography variant="body2">
            <strong>Late:</strong> {subject.late} ({((subject.late / subject.total) * 100).toFixed(1)}%)
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const expandableDailyContent = (record) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Class Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Date:</strong> {record.date}
          </Typography>
          <Typography variant="body2">
            <strong>Day:</strong> {record.day}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Time:</strong> {record.time}
          </Typography>
          <Typography variant="body2">
            <strong>Room:</strong> {record.room}
          </Typography>
        </Grid>
      </Grid>
      {record.status === 'late' && record.late_minutes && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {record.late_minutes} minutes late
        </Alert>
      )}
      {record.status === 'absent' && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Marked absent
        </Alert>
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            My Attendance
          </Typography>
          <Button
            variant="outlined"
            startIcon={<TimelineIcon />}
            size={isMobile ? "small" : "medium"}
          >
            Download Report
          </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Track your attendance across all subjects and view detailed records.
        </Typography>
      </Box>

      {/* Overall Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {mockAttendanceData.overall.percentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Attendance
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
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {mockAttendanceData.overall.present}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classes Present
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
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <TrendingDownIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {mockAttendanceData.overall.absent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classes Absent
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
                    {mockAttendanceData.overall.late}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classes Late
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          Resize your browser window to see the attendance data transform into different layouts!
        </Typography>
      </Alert>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="By Subject" />
          <Tab label="Daily Records" />
          <Tab label="Monthly Summary" />
        </Tabs>

        {/* By Subject Tab */}
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <ResponsiveTable
              columns={subjectColumns}
              data={mockAttendanceData.by_subject}
              onRowClick={handleSubjectRowClick}
              expandable={true}
              expandableContent={expandableSubjectContent}
              emptyMessage="No subject attendance data found"
            />
          )}

          {/* Daily Records Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  placeholder="Search by subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: isMobile ? '100%' : 300 }}
                />
              </Box>

              <ResponsiveTable
                columns={dailyColumns}
                data={flattenedDailyData}
                onRowClick={handleDailyRowClick}
                expandable={true}
                expandableContent={expandableDailyContent}
                emptyMessage="No daily attendance records found"
              />
            </Box>
          )}

          {/* Monthly Summary Tab */}
          {tabValue === 2 && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <FormControl sx={{ minWidth: isMobile ? '100%' : 200 }}>
                  <InputLabel>Filter by Month</InputLabel>
                  <Select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    label="Filter by Month"
                  >
                    <MenuItem value="all">All Months</MenuItem>
                    <MenuItem value="december">December 2023</MenuItem>
                    <MenuItem value="november">November 2023</MenuItem>
                    <MenuItem value="october">October 2023</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <ResponsiveTable
                columns={subjectColumns}
                data={mockAttendanceData.by_subject}
                onRowClick={handleSubjectRowClick}
                expandable={true}
                expandableContent={expandableSubjectContent}
                emptyMessage="No monthly attendance data found"
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Attendance Tips */}
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Attendance Tips" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary" gutterBottom>
                📚 Good Attendance Benefits
              </Typography>
              <Typography variant="body2" paragraph>
                • Better understanding of course material
              </Typography>
              <Typography variant="body2" paragraph>
                • Higher chances of academic success
              </Typography>
              <Typography variant="body2" paragraph>
                • Eligibility for scholarships and awards
              </Typography>
              <Typography variant="body2" paragraph>
                • Stronger relationship with faculty
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="warning.main" gutterBottom>
                ⚠️ Low Attendance Risks
              </Typography>
              <Typography variant="body2" paragraph>
                • Risk of course failure
              </Typography>
              <Typography variant="body2" paragraph>
                • Missing important announcements
              </Typography>
              <Typography variant="body2" paragraph>
                • Reduced participation grades
              </Typography>
              <Typography variant="body2" paragraph>
                • Academic probation possibility
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
