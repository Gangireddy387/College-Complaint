import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Chip,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quick-actions-tabpanel-${index}`}
      aria-labelledby={`quick-actions-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Management = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states - Only Principal management data
  const [departments, setDepartments] = useState([
    {
      id: 1,
      department_code: 'CS',
      name: 'Computer Science',
      description: 'Department of Computer Science and Engineering',
      established_year: '2010',
      email: 'cs@college.edu',
      phone_number: '+1 (555) 123-4567',
      building: 'Engineering Building',
      floor: '2nd Floor',
      room: '201',
      campus: 'Main Campus',
      status: 'active',
      faculty_count: 15,
      student_count: 120,
    },
    {
      id: 2,
      department_code: 'EE',
      name: 'Electrical Engineering',
      description: 'Department of Electrical and Electronics Engineering',
      established_year: '2008',
      email: 'ee@college.edu',
      phone_number: '+1 (555) 234-5678',
      building: 'Engineering Building',
      floor: '3rd Floor',
      room: '301',
      campus: 'Main Campus',
      status: 'active',
      faculty_count: 12,
      student_count: 95,
    },
    {
      id: 3,
      department_code: 'ME',
      name: 'Mechanical Engineering',
      description: 'Department of Mechanical Engineering',
      established_year: '2012',
      email: 'me@college.edu',
      phone_number: '+1 (555) 345-6789',
      building: 'Engineering Building',
      floor: '1st Floor',
      room: '101',
      campus: 'Main Campus',
      status: 'active',
      faculty_count: 18,
      student_count: 150,
    },
    {
      id: 4,
      department_code: 'CE',
      name: 'Civil Engineering',
      description: 'Department of Civil Engineering and Construction',
      established_year: '2005',
      email: 'ce@college.edu',
      phone_number: '+1 (555) 456-7890',
      building: 'Engineering Building',
      floor: '4th Floor',
      room: '401',
      campus: 'Main Campus',
      status: 'active',
      faculty_count: 14,
      student_count: 110,
    },
    {
      id: 5,
      department_code: 'IT',
      name: 'Information Technology',
      description: 'Department of Information Technology and Systems',
      established_year: '2015',
      email: 'it@college.edu',
      phone_number: '+1 (555) 567-8901',
      building: 'Technology Building',
      floor: '2nd Floor',
      room: '205',
      campus: 'Main Campus',
      status: 'active',
      faculty_count: 10,
      student_count: 85,
    },
    {
      id: 6,
      department_code: 'AI',
      name: 'Artificial Intelligence',
      description: 'Department of AI and Machine Learning',
      established_year: '2020',
      email: 'ai@college.edu',
      phone_number: '+1 (555) 678-9012',
      building: 'Innovation Center',
      floor: '1st Floor',
      room: '105',
      campus: 'Main Campus',
      status: 'active',
      faculty_count: 8,
      student_count: 60,
    }
  ]);
  const [faculty, setFaculty] = useState([
    {
      id: 1,
      employee_id: 'FAC001',
      first_name: 'Dr. John',
      last_name: 'Smith',
      designation: 'Professor',
      department_id: 1,
      department_name: 'Computer Science',
      email: 'john.smith@college.edu',
      phone_number: '+1 (555) 111-2222',
      specializations: 'Data Structures, Algorithms',
      joining_date: '2015-08-15',
      current_workload: '12 hours/week',
      status: 'active',
    },
    {
      id: 2,
      employee_id: 'FAC002',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      designation: 'Associate Professor',
      department_id: 1,
      department_name: 'Computer Science',
      email: 'sarah.johnson@college.edu',
      phone_number: '+1 (555) 222-3333',
      specializations: 'Database Systems, Web Development',
      joining_date: '2018-01-10',
      current_workload: '10 hours/week',
      status: 'active',
    },
    {
      id: 3,
      employee_id: 'FAC003',
      first_name: 'Dr. Michael',
      last_name: 'Brown',
      designation: 'Assistant Professor',
      department_id: 2,
      department_name: 'Electrical Engineering',
      email: 'michael.brown@college.edu',
      phone_number: '+1 (555) 333-4444',
      specializations: 'Circuit Design, Electronics',
      joining_date: '2020-06-01',
      current_workload: '8 hours/week',
      status: 'active',
    },
    {
      id: 4,
      employee_id: 'FAC004',
      first_name: 'Dr. Emily',
      last_name: 'Davis',
      designation: 'Professor',
      department_id: 2,
      department_name: 'Electrical Engineering',
      email: 'emily.davis@college.edu',
      phone_number: '+1 (555) 444-5555',
      specializations: 'Power Systems, Control Theory',
      joining_date: '2012-03-20',
      current_workload: '14 hours/week',
      status: 'active',
    },
    {
      id: 5,
      employee_id: 'FAC005',
      first_name: 'Dr. Robert',
      last_name: 'Wilson',
      designation: 'Associate Professor',
      department_id: 3,
      department_name: 'Mechanical Engineering',
      email: 'robert.wilson@college.edu',
      phone_number: '+1 (555) 555-6666',
      specializations: 'Thermodynamics, Fluid Mechanics',
      joining_date: '2016-09-15',
      current_workload: '11 hours/week',
      status: 'active',
    },
    {
      id: 6,
      employee_id: 'FAC006',
      first_name: 'Dr. Lisa',
      last_name: 'Anderson',
      designation: 'Assistant Professor',
      department_id: 3,
      department_name: 'Mechanical Engineering',
      email: 'lisa.anderson@college.edu',
      phone_number: '+1 (555) 666-7777',
      specializations: 'Robotics, Automation',
      joining_date: '2021-01-10',
      current_workload: '9 hours/week',
      status: 'active',
    },
    {
      id: 7,
      employee_id: 'FAC007',
      first_name: 'Dr. David',
      last_name: 'Martinez',
      designation: 'Professor',
      department_id: 4,
      department_name: 'Civil Engineering',
      email: 'david.martinez@college.edu',
      phone_number: '+1 (555) 777-8888',
      specializations: 'Structural Engineering, Construction',
      joining_date: '2010-07-01',
      current_workload: '13 hours/week',
      status: 'active',
    },
    {
      id: 8,
      employee_id: 'FAC008',
      first_name: 'Dr. Jennifer',
      last_name: 'Taylor',
      designation: 'Associate Professor',
      department_id: 5,
      department_name: 'Information Technology',
      email: 'jennifer.taylor@college.edu',
      phone_number: '+1 (555) 888-9999',
      specializations: 'Network Security, Cloud Computing',
      joining_date: '2017-11-05',
      current_workload: '10 hours/week',
      status: 'active',
    }
  ]);
  
  // Quick Actions states
  const [activeTab, setActiveTab] = useState(0);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [departmentFormData, setDepartmentFormData] = useState({
    department_code: '',
    name: '',
    description: '',
    established_year: '',
    email: '',
    phone_number: '',
    building: '',
    floor: '',
    room: '',
    campus: '',
    status: 'active'
  });
  const [facultyFormData, setFacultyFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    designation: '',
    department_id: '',
    email: '',
    phone_number: '',
    specializations: '',
    joining_date: '',
    current_workload: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Convert departments data for ResponsiveTable
  const departmentColumns = [
    {
      field: 'name',
      headerName: 'Department Name',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'department_code',
      headerName: 'Code',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'established_year',
      headerName: 'Established',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'building',
      headerName: 'Building',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (value) => (
        <Chip
          label={value}
          size="small"
          color={value === 'active' ? 'success' : 'error'}
          variant="outlined"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
  ];

  // Convert faculty data for ResponsiveTable
  const facultyColumns = [
    {
      field: 'first_name',
      headerName: 'First Name',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'employee_id',
      headerName: 'Employee ID',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'department_name',
      headerName: 'Department',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'joining_date',
      headerName: 'Joining Date',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'current_workload',
      headerName: 'Workload',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (value) => (
        <Chip
          label={value}
          size="small"
          color={value === 'active' ? 'success' : 'error'}
          variant="outlined"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
  ];

  const handleDepartmentRowClick = (department) => {
    console.log('Department clicked:', department);
    // Navigate to department details
  };

  const handleFacultyRowClick = (faculty) => {
    console.log('Faculty clicked:', faculty);
    // Navigate to faculty details
  };

  const handleEditDepartment = (department) => {
    console.log('Edit department:', department);
    // Open edit dialog
  };

  const handleDeleteDepartment = (department) => {
    console.log('Delete department:', department);
    // Show confirmation dialog
  };

  const handleEditFaculty = (faculty) => {
    console.log('Edit faculty:', faculty);
    // Open edit dialog
  };

  const handleDeleteFaculty = (faculty) => {
    console.log('Delete faculty:', faculty);
    // Show confirmation dialog
  };

  const expandableDepartmentContent = (department) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Department Details
                </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Description:</strong> {department.description}
                      </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {department.email}
                      </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {department.phone_number}
          </Typography>
                  </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Location:</strong> {department.building}, {department.floor}, Room {department.room}
                      </Typography>
          <Typography variant="body2">
            <strong>Campus:</strong> {department.campus}
                      </Typography>
          <Typography variant="body2">
            <strong>Faculty Count:</strong> {department.faculty_count}
                      </Typography>
          <Typography variant="body2">
            <strong>Student Count:</strong> {department.student_count}
                      </Typography>
                  </Grid>
                </Grid>
              </Box>
  );

  const expandableFacultyContent = (faculty) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Faculty Details
              </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Email:</strong> {faculty.email}
              </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {faculty.phone_number}
                </Typography>
          <Typography variant="body2">
            <strong>Department:</strong> {faculty.department_name}
                      </Typography>
                  </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Specializations:</strong> {faculty.specializations}
                      </Typography>
          <Typography variant="body2">
            <strong>Joining Date:</strong> {faculty.joining_date}
                      </Typography>
          <Typography variant="body2">
            <strong>Current Workload:</strong> {faculty.current_workload}
                      </Typography>
                  </Grid>
                </Grid>
              </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            College Management
          </Typography>
              <Button
                variant="contained"
            startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setActiveTab(0)}
          >
            Quick Actions
              </Button>
                    </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Manage departments, faculty, and overall college administration.
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
          Resize your browser window to see the management data transform into different layouts!
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <Chip 
            label="Desktop (≥1200px)" 
            size="small" 
            color={!isTablet ? 'primary' : 'default'}
            variant={!isTablet ? 'filled' : 'outlined'}
          />
          <Chip 
            label="Tablet (900-1200px)" 
            size="small" 
            color={isTablet && !isMobile ? 'primary' : 'default'}
            variant={isTablet && !isMobile ? 'filled' : 'outlined'}
          />
          <Chip 
            label="Mobile (<900px)" 
            size="small" 
            color={isMobile ? 'primary' : 'default'}
            variant={isMobile ? 'filled' : 'outlined'}
          />
        </Box>
      </Alert>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="Departments" />
          <Tab label="Faculty" />
          <Tab label="Quick Actions" />
              </Tabs>

        {/* Departments Tab */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddDepartmentOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Add Department
                </Button>
              </Box>
              
              <ResponsiveTable
                columns={departmentColumns}
                data={departments}
                onRowClick={handleDepartmentRowClick}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
                expandable={true}
                expandableContent={expandableDepartmentContent}
                emptyMessage="No departments found"
              />
                  </Box>
          )}

          {/* Faculty Tab */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddFacultyOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Add Faculty
                </Button>
              </Box>
              
              <ResponsiveTable
                columns={facultyColumns}
                data={faculty}
                onRowClick={handleFacultyRowClick}
                onEdit={handleEditFaculty}
                onDelete={handleDeleteFaculty}
                expandable={true}
                expandableContent={expandableFacultyContent}
                emptyMessage="No faculty found"
              />
            </Box>
          )}

          {/* Quick Actions Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Add Department
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create a new department with all necessary details.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => setIsAddDepartmentOpen(true)}>
                        Add Department
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Add Faculty
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Register new faculty members to departments.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => setIsAddFacultyOpen(true)}>
                        Add Faculty
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        View Reports
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Generate and view various college reports.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">
                        View Reports
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Add Department Dialog */}
      <Dialog
        open={isAddDepartmentOpen}
        onClose={() => setIsAddDepartmentOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Department form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDepartmentOpen(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Faculty Dialog */}
      <Dialog
        open={isAddFacultyOpen}
        onClose={() => setIsAddFacultyOpen(false)}
        maxWidth="md"
                    fullWidth
      >
        <DialogTitle>Add New Faculty</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Faculty form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddFacultyOpen(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
