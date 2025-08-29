import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useSelector((state) => state.auth);

  // Mock data for reports
  const [reportsData, setReportsData] = useState({
    academic: {
      totalStudents: 1250,
      totalFaculty: 85,
      totalDepartments: 8,
      averageAttendance: 87.5,
      averageCGPA: 8.2,
      graduationRate: 94.2
    },
    departments: [
      { id: 1, name: 'Computer Science', students: 180, faculty: 12, avgCGPA: 8.5, attendance: 89.2 },
      { id: 2, name: 'Electrical Engineering', students: 165, faculty: 10, avgCGPA: 8.1, attendance: 86.8 },
      { id: 3, name: 'Mechanical Engineering', students: 155, faculty: 9, avgCGPA: 8.3, attendance: 88.1 },
      { id: 4, name: 'Mathematics', students: 120, faculty: 8, avgCGPA: 8.7, attendance: 90.5 },
      { id: 5, name: 'Physics', students: 95, faculty: 7, avgCGPA: 8.4, attendance: 87.9 }
    ],
    attendance: [
      { date: '2024-01-15', totalStudents: 1250, present: 1095, absent: 155, percentage: 87.6 },
      { date: '2024-01-16', totalStudents: 1250, present: 1110, absent: 140, percentage: 88.8 },
      { date: '2024-01-17', totalStudents: 1250, present: 1080, absent: 170, percentage: 86.4 },
      { date: '2024-01-18', totalStudents: 1250, present: 1125, absent: 125, percentage: 90.0 },
      { date: '2024-01-19', totalStudents: 1250, present: 1105, absent: 145, percentage: 88.4 }
    ],
    complaints: [
      { id: 1, type: 'Academic', status: 'Resolved', count: 45, percentage: 60.0 },
      { id: 2, type: 'Infrastructure', status: 'In Progress', count: 20, percentage: 26.7 },
      { id: 3, type: 'Administrative', status: 'Pending', count: 10, percentage: 13.3 }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGenerateReport = (reportType) => {
    setIsLoading(true);
    // Simulate report generation
    setTimeout(() => {
      setIsLoading(false);
      // Here you would typically generate and download the report
      console.log(`Generating ${reportType} report...`);
    }, 2000);
  };

  const handleDownloadReport = (reportType) => {
    // Here you would typically download the generated report
    console.log(`Downloading ${reportType} report...`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'error';
      default: return 'default';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive academic and administrative reports"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Reports', path: '/principal/reports' },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Students
                  </Typography>
                  <Typography variant="h4">
                    {reportsData.academic.totalStudents}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Faculty
                  </Typography>
                  <Typography variant="h4">
                    {reportsData.academic.totalFaculty}
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg Attendance
                  </Typography>
                  <Typography variant="h4">
                    {reportsData.academic.averageAttendance}%
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg CGPA
                  </Typography>
                  <Typography variant="h4">
                    {reportsData.academic.averageCGPA}
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reports Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="reports tabs">
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Department Reports
                </Box>
              }
              id="reports-tab-0"
              aria-controls="reports-tabpanel-0"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon />
                  Attendance Reports
                </Box>
              }
              id="reports-tab-1"
              aria-controls="reports-tabpanel-1"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon />
                  Complaint Reports
                </Box>
              }
              id="reports-tab-2"
              aria-controls="reports-tabpanel-2"
            />
          </Tabs>
        </Box>

        {/* Department Reports Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Department Performance Overview</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="current_month">Current Month</MenuItem>
                  <MenuItem value="last_month">Last Month</MenuItem>
                  <MenuItem value="current_semester">Current Semester</MenuItem>
                  <MenuItem value="last_semester">Last Semester</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleGenerateReport('department')}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : 'Generate Report'}
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell><strong>Students</strong></TableCell>
                  <TableCell><strong>Faculty</strong></TableCell>
                  <TableCell><strong>Avg CGPA</strong></TableCell>
                  <TableCell><strong>Attendance %</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportsData.departments.map((dept) => (
                  <TableRow key={dept.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {dept.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{dept.students}</TableCell>
                    <TableCell>{dept.faculty}</TableCell>
                    <TableCell>{dept.avgCGPA}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${dept.attendance}%`}
                        color={getAttendanceColor(dept.attendance)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Report">
                          <IconButton size="small" color="secondary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Attendance Reports Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Daily Attendance Overview</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search by date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleGenerateReport('attendance')}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : 'Generate Report'}
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Total Students</strong></TableCell>
                  <TableCell><strong>Present</strong></TableCell>
                  <TableCell><strong>Absent</strong></TableCell>
                  <TableCell><strong>Attendance %</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportsData.attendance.map((record, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.totalStudents}</TableCell>
                    <TableCell>{record.present}</TableCell>
                    <TableCell>{record.absent}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${record.percentage}%`}
                        color={getAttendanceColor(record.percentage)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Report">
                          <IconButton size="small" color="secondary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Complaint Reports Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Complaint Status Overview</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="cs">Computer Science</MenuItem>
                  <MenuItem value="ee">Electrical Engineering</MenuItem>
                  <MenuItem value="me">Mechanical Engineering</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleGenerateReport('complaints')}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : 'Generate Report'}
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Complaint Type</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Count</strong></TableCell>
                  <TableCell><strong>Percentage</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportsData.complaints.map((complaint) => (
                  <TableRow key={complaint.id} hover>
                    <TableCell>{complaint.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status}
                        color={getStatusColor(complaint.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{complaint.count}</TableCell>
                    <TableCell>{complaint.percentage}%</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Report">
                          <IconButton size="small" color="secondary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>
    </Box>
  );
};
