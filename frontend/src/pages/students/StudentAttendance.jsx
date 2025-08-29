import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [monthFilter, setMonthFilter] = useState('');
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Attendance Records
        </Typography>
        <Button
          variant="outlined"
          startIcon={<TimelineIcon />}
          onClick={() => navigate('/students/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Overall Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {attendanceData.overall.percentage}%
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
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="primary">
                    {attendanceData.overall.total_classes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Classes
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
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {attendanceData.overall.present}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Present
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
                  <Typography variant="h4" color="error.main">
                    {attendanceData.overall.absent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Absent
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Attendance Progress</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={attendanceData.overall.percentage}
                color={getProgressColor(attendanceData.overall.percentage)}
                sx={{ height: 12, borderRadius: 6 }}
              />
            </Box>
            <Typography variant="h6" color="primary">
              {attendanceData.overall.percentage}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Present: {attendanceData.overall.present} | Absent: {attendanceData.overall.absent} | Late: {attendanceData.overall.late}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="attendance tabs">
          <Tab label="Subject-wise" />
          <Tab label="Daily Records" />
          <Tab label="Monthly Summary" />
        </Tabs>

        {/* Subject-wise Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Filter by Subject</InputLabel>
              <Select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                label="Filter by Subject"
              >
                <MenuItem value="">All Subjects</MenuItem>
                {attendanceData.by_subject.map((subject) => (
                  <MenuItem key={subject.subject} value={subject.subject}>
                    {subject.subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Faculty</TableCell>
                  <TableCell>Total Classes</TableCell>
                  <TableCell>Present</TableCell>
                  <TableCell>Absent</TableCell>
                  <TableCell>Late</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubjectData.map((subject) => (
                  <TableRow key={subject.subject}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {subject.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>{subject.faculty}</TableCell>
                    <TableCell>{subject.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={subject.present}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subject.absent}
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subject.late}
                        color="warning"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {subject.percentage}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={subject.percentage}
                            color={getProgressColor(subject.percentage)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Daily Records Tab */}
        <TabPanel value={tabValue} index={1}>
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
              sx={{ minWidth: 300 }}
            />
          </Box>

          {filteredDailyData.map((day) => (
            <Card key={day.date} sx={{ mb: 2 }}>
              <CardHeader
                title={`${day.day}, ${day.date}`}
                avatar={<ScheduleIcon />}
              />
              <CardContent>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Room</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {day.subjects.map((subject, index) => (
                        <TableRow key={index}>
                          <TableCell>{subject.name}</TableCell>
                          <TableCell>{subject.time}</TableCell>
                          <TableCell>{subject.room}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(subject.status)}
                              color={getStatusColor(subject.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {subject.status === 'late' && subject.late_minutes && (
                              <Typography variant="body2" color="warning.main">
                                {subject.late_minutes} minutes late
                              </Typography>
                            )}
                            {subject.status === 'absent' && (
                              <Typography variant="body2" color="error.main">
                                Marked absent
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </TabPanel>

        {/* Monthly Summary Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Month</InputLabel>
              <Select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                label="Filter by Month"
              >
                <MenuItem value="">All Months</MenuItem>
                {attendanceData.monthly_summary.map((month) => (
                  <MenuItem key={month.month} value={month.month}>
                    {month.month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Total Classes</TableCell>
                  <TableCell>Present</TableCell>
                  <TableCell>Absent</TableCell>
                  <TableCell>Late</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMonthlyData.map((month) => (
                  <TableRow key={month.month}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {month.month}
                      </Typography>
                    </TableCell>
                    <TableCell>{month.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={month.present}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={month.absent}
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={month.late}
                        color="warning"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {month.percentage}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={month.percentage}
                            color={getProgressColor(month.percentage)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
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
