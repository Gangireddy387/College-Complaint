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

} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states - Only Principal management data
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  
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

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleNavigateToDepartments = () => {
    navigate('/principal/departments');
  };

  const handleNavigateToFaculty = () => {
    navigate('/principal/faculty');
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Department form handlers
  const handleAddDepartment = () => {
    setDepartmentFormData({
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
    setFormErrors({});
    setIsAddDepartmentOpen(true);
  };

  const handleDepartmentFormSubmit = async () => {
    const errors = {};
    if (!departmentFormData.department_code) errors.department_code = 'Department code is required';
    if (!departmentFormData.name) errors.name = 'Department name is required';
    if (!departmentFormData.description) errors.description = 'Description is required';
    if (!departmentFormData.established_year) errors.established_year = 'Established year is required';
    if (!departmentFormData.email) errors.email = 'Email is required';
    if (!departmentFormData.phone_number) errors.phone_number = 'Phone number is required';
    if (!departmentFormData.building) errors.building = 'Building is required';
    if (!departmentFormData.floor) errors.floor = 'Floor is required';
    if (!departmentFormData.room) errors.room = 'Room is required';
    if (!departmentFormData.campus) errors.campus = 'Campus is required';
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsLoading(true);
      const newDepartment = {
        ...departmentFormData,
        id: Date.now(),
        location: {
          building: departmentFormData.building,
          floor: departmentFormData.floor,
          room: departmentFormData.room,
          campus: departmentFormData.campus
        },
        facilities: [],
        programs: [],
        research_areas: [],
        total_students: 0,
        total_faculty: 0,
        budget: 0,
        createdAt: new Date().toISOString()
      };
      
      setDepartments(prev => [...prev, newDepartment]);
      setIsAddDepartmentOpen(false);
      setDepartmentFormData({
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Faculty form handlers
  const handleAddFaculty = () => {
    setFacultyFormData({
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
    setFormErrors({});
    setIsAddFacultyOpen(true);
  };

  const handleFacultyFormSubmit = async () => {
    const errors = {};
    if (!facultyFormData.employee_id) errors.employee_id = 'Employee ID is required';
    if (!facultyFormData.first_name) errors.first_name = 'First name is required';
    if (!facultyFormData.last_name) errors.last_name = 'Last name is required';
    if (!facultyFormData.designation) errors.designation = 'Designation is required';
    if (!facultyFormData.department_id) errors.department_id = 'Department is required';
    if (!facultyFormData.email) errors.email = 'Email is required';
    if (!facultyFormData.phone_number) errors.phone_number = 'Phone number is required';
    if (!facultyFormData.joining_date) errors.joining_date = 'Joining date is required';
    if (!facultyFormData.current_workload) errors.current_workload = 'Current workload is required';
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsLoading(true);
      const newFaculty = {
        ...facultyFormData,
        id: Date.now(),
        specializations: facultyFormData.specializations ? facultyFormData.specializations.split(',').map(s => s.trim()) : [],
        current_workload: parseInt(facultyFormData.current_workload),
        qualifications: [],
        experience: [],
        publications: [],
        achievements: [],
        createdAt: new Date().toISOString()
      };
      
      setFaculty(prev => [...prev, newFaculty]);
      setIsAddFacultyOpen(false);
      setFacultyFormData({
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value, formType) => {
    if (formType === 'department') {
      setDepartmentFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFacultyFormData(prev => ({ ...prev, [field]: value }));
    }
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown';
  };

  // Mock data for Principal management only - Updated to match backend model structure
  useEffect(() => {
    setDepartments([
      { 
        id: 1, 
        department_code: 'CS', 
        name: 'Computer Science', 
        description: 'Computer Science Department focusing on software engineering and AI', 
        established_year: 2020,
        email: 'cs@college.edu',
        phone_number: '9876543210',
        location: { building: 'Main Building', floor: '2nd Floor', room: 'Room 201', campus: 'Main Campus' },
        facilities: ['Computer Lab', 'Library', 'Conference Room'],
        programs: [{ name: 'B.Tech Computer Science', duration: '4 Years', type: 'Undergraduate' }],
        research_areas: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
        status: 'active',
        total_students: 120,
        total_faculty: 8,
        budget: 500000
      },
      { 
        id: 2, 
        department_code: 'EE', 
        name: 'Electrical Engineering', 
        description: 'Electrical Engineering Department with focus on power systems', 
        established_year: 2020,
        email: 'ee@college.edu',
        phone_number: '9876543211',
        location: { building: 'Engineering Building', floor: '1st Floor', room: 'Room 101', campus: 'Main Campus' },
        facilities: ['Electronics Lab', 'Power Lab', 'Seminar Hall'],
        programs: [{ name: 'B.Tech Electrical Engineering', duration: '4 Years', type: 'Undergraduate' }],
        research_areas: ['Power Systems', 'Control Systems', 'Electronics'],
        status: 'active',
        total_students: 95,
        total_faculty: 6,
        budget: 400000
      },
      { 
        id: 3, 
        department_code: 'ME', 
        name: 'Mechanical Engineering', 
        description: 'Mechanical Engineering Department specializing in manufacturing', 
        established_year: 2020,
        email: 'me@college.edu',
        phone_number: '9876543212',
        location: { building: 'Engineering Building', floor: '2nd Floor', room: 'Room 201', campus: 'Main Campus' },
        facilities: ['Machine Shop', 'CAD Lab', 'Workshop'],
        programs: [{ name: 'B.Tech Mechanical Engineering', duration: '4 Years', type: 'Undergraduate' }],
        research_areas: ['Manufacturing', 'Thermal Engineering', 'Robotics'],
        status: 'active',
        total_students: 110,
        total_faculty: 7,
        budget: 450000
      }
    ]);
    
    setFaculty([
      { 
        id: 1, 
        employee_id: 'CS001', 
        first_name: 'John', 
        last_name: 'Doe', 
        designation: 'Assistant Professor', 
        department_id: 1, 
        email: 'john.doe@college.edu', 
        phone_number: '9876543201', 
        specializations: ['Software Engineering', 'Database Systems'],
        qualifications: [{ degree: 'Ph.D.', institution: 'IIT Delhi', year: 2020, percentage: '95%' }],
        joining_date: '2021-01-01', 
        experience: [{ position: 'Research Scholar', organization: 'IIT Delhi', from_date: '2017-01-01', to_date: '2020-12-31', description: 'Research in database systems' }],
        publications: [{ title: 'Advanced Database Design', journal: 'Computer Science Journal', year: 2021, doi: '10.1000/abc123' }],
        achievements: [{ title: 'Best Paper Award', year: 2021, description: 'Awarded for research excellence' }],
        current_workload: 16,
        status: 'active'
      },
      { 
        id: 2, 
        employee_id: 'CS002', 
        first_name: 'Jane', 
        last_name: 'Smith', 
        designation: 'Associate Professor', 
        department_id: 1, 
        email: 'jane.smith@college.edu', 
        phone_number: '9876543202', 
        specializations: ['Artificial Intelligence', 'Machine Learning'],
        qualifications: [{ degree: 'Ph.D.', institution: 'IISc Bangalore', year: 2018, percentage: '92%' }],
        joining_date: '2020-03-01', 
        experience: [{ position: 'Assistant Professor', organization: 'NIT Surathkal', from_date: '2018-01-01', to_date: '2020-02-28', description: 'Teaching and research in AI' }],
        publications: [{ title: 'Machine Learning Applications', journal: 'AI Research Journal', year: 2020, doi: '10.1000/def456' }],
        achievements: [{ title: 'Young Scientist Award', year: 2020, description: 'Recognition for AI research' }],
        current_workload: 18,
        status: 'active'
      },
      { 
        id: 3, 
        employee_id: 'EE001', 
        first_name: 'Michael', 
        last_name: 'Johnson', 
        designation: 'Professor', 
        department_id: 2, 
        email: 'michael.johnson@college.edu', 
        phone_number: '9876543203', 
        specializations: ['Power Systems', 'Control Systems'],
        qualifications: [{ degree: 'Ph.D.', institution: 'IIT Bombay', year: 2015, percentage: '90%' }],
        joining_date: '2018-06-01', 
        experience: [{ position: 'Associate Professor', organization: 'NIT Trichy', from_date: '2015-01-01', to_date: '2018-05-31', description: 'Teaching power systems engineering' }],
        publications: [{ title: 'Modern Power Systems', journal: 'Electrical Engineering Journal', year: 2019, doi: '10.1000/ghi789' }],
        achievements: [{ title: 'Excellence in Teaching', year: 2019, description: 'Awarded for outstanding teaching' }],
        current_workload: 20,
        status: 'active'
      }
    ]);
  }, []);

  if (isLoading && !departments.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Principal Management"
        subtitle="Manage academic departments and faculty members"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Management', path: '/principal/management' },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={handleCloseError}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Department Management Card */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
              <BusinessIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Department Management
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Manage academic departments, their locations, facilities, and academic programs.
              </Typography>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Current Status
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {departments.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Departments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary.main" fontWeight="bold">
                        {departments.reduce((sum, dept) => sum + dept.total_students, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Students
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {departments.reduce((sum, dept) => sum + dept.total_faculty, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Faculty
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowForwardIcon />}
                onClick={handleNavigateToDepartments}
                sx={{ minWidth: 200 }}
              >
                Manage Departments
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Faculty Management Card */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
              <PeopleIcon sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Faculty Management
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Manage faculty members, their specializations, workload, and academic profiles.
              </Typography>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" color="secondary.main" gutterBottom>
                  Current Status
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary.main" fontWeight="bold">
                        {faculty.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Faculty Members
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        {faculty.filter(f => f.status === 'active').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Members
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main" fontWeight="bold">
                        {faculty.reduce((sum, f) => sum + f.current_workload, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Workload (hrs/week)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowForwardIcon />}
                onClick={handleNavigateToFaculty}
                sx={{ minWidth: 200 }}
                color="secondary"
              >
                Manage Faculty
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions Card with Tabs */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="quick actions tabs">
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AddIcon />
                      Add Department
                    </Box>
                  }
                  id="quick-actions-tab-0"
                  aria-controls="quick-actions-tabpanel-0"
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AddIcon />
                      Add Faculty
                    </Box>
                  }
                  id="quick-actions-tab-1"
                  aria-controls="quick-actions-tabpanel-1"
                />
              </Tabs>
            </Box>





            {/* Add Department Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Add New Department
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ArrowForwardIcon />}
                  onClick={handleNavigateToDepartments}
                >
                  Full Management
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Department Code"
                    value={departmentFormData.department_code}
                    onChange={(e) => handleInputChange('department_code', e.target.value, 'department')}
                    error={!!formErrors.department_code}
                    helperText={formErrors.department_code}
                    placeholder="e.g., CS, EE, ME"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Department Name"
                    value={departmentFormData.name}
                    onChange={(e) => handleInputChange('name', e.target.value, 'department')}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    placeholder="e.g., Computer Science"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={departmentFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value, 'department')}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                    multiline
                    rows={3}
                    placeholder="Brief description of the department"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Established Year"
                    value={departmentFormData.established_year}
                    onChange={(e) => handleInputChange('established_year', e.target.value, 'department')}
                    error={!!formErrors.established_year}
                    helperText={formErrors.established_year}
                    type="number"
                    placeholder="e.g., 2020"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={departmentFormData.status}
                      onChange={(e) => handleInputChange('status', e.target.value, 'department')}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="suspended">Suspended</MenuItem>
                    </Select>
                    {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={departmentFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value, 'department')}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    type="email"
                    placeholder="department@college.edu"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={departmentFormData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value, 'department')}
                    error={!!formErrors.phone_number}
                    helperText={formErrors.phone_number}
                    placeholder="9876543210"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Building"
                    value={departmentFormData.building}
                    onChange={(e) => handleInputChange('building', e.target.value, 'department')}
                    error={!!formErrors.building}
                    helperText={formErrors.building}
                    placeholder="e.g., Main Building"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Floor"
                    value={departmentFormData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value, 'department')}
                    error={!!formErrors.floor}
                    helperText={formErrors.floor}
                    placeholder="e.g., 2nd Floor"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Room"
                    value={departmentFormData.room}
                    onChange={(e) => handleInputChange('room', e.target.value, 'department')}
                    error={!!formErrors.room}
                    helperText={formErrors.room}
                    placeholder="e.g., Room 201"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Campus"
                    value={departmentFormData.campus}
                    onChange={(e) => handleInputChange('campus', e.target.value, 'department')}
                    error={!!formErrors.campus}
                    helperText={formErrors.campus}
                    placeholder="e.g., Main Campus"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setActiveTab(0)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleDepartmentFormSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Create Department'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Add Faculty Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Add New Faculty Member
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ArrowForwardIcon />}
                  onClick={handleNavigateToFaculty}
                >
                  Full Management
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={facultyFormData.employee_id}
                    onChange={(e) => handleInputChange('employee_id', e.target.value, 'faculty')}
                    error={!!formErrors.employee_id}
                    helperText={formErrors.employee_id}
                    placeholder="e.g., CS001, EE001"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={facultyFormData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value, 'faculty')}
                    error={!!formErrors.first_name}
                    helperText={formErrors.first_name}
                    placeholder="e.g., John"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={facultyFormData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value, 'faculty')}
                    error={!!formErrors.last_name}
                    helperText={formErrors.last_name}
                    placeholder="e.g., Doe"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    value={facultyFormData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value, 'faculty')}
                    error={!!formErrors.designation}
                    helperText={formErrors.designation}
                    placeholder="e.g., Assistant Professor"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.department_id}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={facultyFormData.department_id}
                      onChange={(e) => handleInputChange('department_id', e.target.value, 'faculty')}
                      label="Department"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name} ({dept.department_code})
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.department_id && <FormHelperText>{formErrors.department_id}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={facultyFormData.status}
                      onChange={(e) => handleInputChange('status', e.target.value, 'faculty')}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="on_leave">On Leave</MenuItem>
                    </Select>
                    {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={facultyFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value, 'faculty')}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    type="email"
                    placeholder="faculty@college.edu"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={facultyFormData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value, 'faculty')}
                    error={!!formErrors.phone_number}
                    helperText={formErrors.phone_number}
                    placeholder="9876543210"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specializations"
                    value={facultyFormData.specializations}
                    onChange={(e) => handleInputChange('specializations', e.target.value, 'faculty')}
                    placeholder="e.g., Software Engineering, Database Systems (comma separated)"
                    helperText="Enter specializations separated by commas"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Joining Date"
                    value={facultyFormData.joining_date}
                    onChange={(e) => handleInputChange('joining_date', e.target.value, 'faculty')}
                    error={!!formErrors.joining_date}
                    helperText={formErrors.joining_date}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Workload (hrs/week)"
                    value={facultyFormData.current_workload}
                    onChange={(e) => handleInputChange('current_workload', e.target.value, 'faculty')}
                    error={!!formErrors.current_workload}
                    helperText={formErrors.current_workload}
                    type="number"
                    placeholder="16"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setActiveTab(0)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleFacultyFormSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Create Faculty Member'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
