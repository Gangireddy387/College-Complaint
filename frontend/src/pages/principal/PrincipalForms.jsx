import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../components/shared/PageHeader';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`forms-tabpanel-${index}`}
      aria-labelledby={`forms-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PrincipalForms = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  // Mock data for different forms
  const [formsData, setFormsData] = useState({
    students: [
      { id: 1, name: 'John Doe', roll: 'CS001', department: 'Computer Science', status: 'Active' },
      { id: 2, name: 'Jane Smith', roll: 'CS002', department: 'Computer Science', status: 'Active' },
      { id: 3, name: 'Mike Johnson', roll: 'EE001', department: 'Electrical Engineering', status: 'Active' },
    ],
    attendance: [
      { id: 1, date: '2024-01-15', totalStudents: 150, present: 135, absent: 15, percentage: 90.0 },
      { id: 2, date: '2024-01-16', totalStudents: 150, present: 142, absent: 8, percentage: 94.7 },
      { id: 3, date: '2024-01-17', totalStudents: 150, present: 138, absent: 12, percentage: 92.0 },
    ],
    complaints: [
      { id: 1, type: 'Academic', student: 'John Doe', description: 'Grade dispute', status: 'Pending', priority: 'High' },
      { id: 2, type: 'Infrastructure', student: 'Jane Smith', description: 'Lab equipment issue', status: 'In Progress', priority: 'Medium' },
      { id: 3, type: 'Administrative', student: 'Mike Johnson', description: 'Document request', status: 'Resolved', priority: 'Low' },
    ],
    sections: [
      { id: 1, name: 'CS101-A', course: 'Introduction to Programming', students: 35, capacity: 40, status: 'Open' },
      { id: 2, name: 'CS101-B', course: 'Introduction to Programming', students: 38, capacity: 40, status: 'Full' },
      { id: 3, name: 'EE201-A', course: 'Circuit Theory', students: 28, capacity: 35, status: 'Open' },
    ]
  });

  const forms = [
    {
      id: 'students',
      title: 'Student Management',
      description: 'View and manage student information and academic details',
      icon: <PersonIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      id: 'attendance',
      title: 'Attendance Management',
      description: 'View and manage student attendance records',
      icon: <ScheduleIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
    },
    {
      id: 'complaints',
      title: 'Disciplinary Complaints',
      description: 'View and manage disciplinary complaints',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      color: theme.palette.error.main,
    },
    {
      id: 'sections',
      title: 'Section Enrollment',
      description: 'View and manage student enrollment in course sections',
      icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Open':
      case 'Resolved':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'error';
      case 'Full':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <PageHeader
        title="Principal Forms & Management"
        subtitle="Comprehensive management tools for academic administration"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Forms & Management', path: '/principal/forms' },
        ]}
      />

      {/* Quick Access Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={3} key={form.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => {
                const tabIndex = forms.findIndex(f => f.id === form.id);
                setActiveTab(tabIndex);
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {form.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {form.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, minHeight: '3rem' }}
                >
                  {form.description}
                </Typography>
                <Chip 
                  label="View Details" 
                  size="small" 
                  sx={{ 
                    backgroundColor: form.color,
                    color: 'white',
                    fontWeight: 500,
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Forms Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="forms tabs">
            {forms.map((form, index) => (
              <Tab
                key={form.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {form.icon}
                    {form.title}
                  </Box>
                }
                id={`forms-tab-${index}`}
                aria-controls={`forms-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {/* Students Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Student Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add New Student
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Roll Number</strong></TableCell>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formsData.students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        color={getStatusColor(student.status)}
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
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
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

        {/* Attendance Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Attendance Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Mark Attendance
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Total Students</strong></TableCell>
                  <TableCell><strong>Present</strong></TableCell>
                  <TableCell><strong>Absent</strong></TableCell>
                  <TableCell><strong>Percentage</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formsData.attendance.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.totalStudents}</TableCell>
                    <TableCell>{record.present}</TableCell>
                    <TableCell>{record.absent}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${record.percentage}%`}
                        color={getStatusColor(record.percentage >= 90 ? 'Active' : record.percentage >= 80 ? 'In Progress' : 'Pending')}
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
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary">
                            <EditIcon />
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

        {/* Complaints Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Disciplinary Complaints</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              New Complaint
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Priority</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formsData.complaints.map((complaint) => (
                  <TableRow key={complaint.id} hover>
                    <TableCell>{complaint.type}</TableCell>
                    <TableCell>{complaint.student}</TableCell>
                    <TableCell>{complaint.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status}
                        color={getStatusColor(complaint.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.priority}
                        color={getPriorityColor(complaint.priority)}
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
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
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

        {/* Sections Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Section Enrollment</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Create Section
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Section</strong></TableCell>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Students</strong></TableCell>
                  <TableCell><strong>Capacity</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formsData.sections.map((section) => (
                  <TableRow key={section.id} hover>
                    <TableCell>{section.name}</TableCell>
                    <TableCell>{section.course}</TableCell>
                    <TableCell>{section.students}</TableCell>
                    <TableCell>{section.capacity}</TableCell>
                    <TableCell>
                      <Chip
                        label={section.status}
                        color={getStatusColor(section.status)}
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
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
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

export { PrincipalForms };
