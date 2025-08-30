import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

export const DepartmentManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { user } = useSelector((state) => state.auth);

  const handleAdd = () => {
    navigate('/principal/departments/add');
  };

  const handleEdit = (item) => {
    // For now, just show an alert. You can implement edit functionality later
    alert('Edit functionality will be implemented in a separate page');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        setIsLoading(true);
        setDepartments(prev => prev.filter(item => item.id !== id));
        setSuccessMessage('Department deleted successfully');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleRowClick = (department) => {
    console.log('Department clicked:', department);
    // Navigate to department details
  };

  // Mock data for departments
  useEffect(() => {
    const mockDepartments = [
      { 
        id: 1, 
        department_code: 'CS', 
        name: 'Computer Science', 
        description: 'Computer Science Department focusing on software engineering and AI', 
        established_year: 2020,
        email: 'cs@college.edu',
        phone_number: '9876543210',
        building: 'Main Building',
        floor: '2nd Floor',
        room: 'Room 201',
        campus: 'Main Campus',
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
        building: 'Engineering Building',
        floor: '1st Floor',
        room: 'Room 101',
        campus: 'Main Campus',
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
        description: 'Mechanical Engineering Department with focus on manufacturing and design', 
        established_year: 2020,
        email: 'me@college.edu',
        phone_number: '9876543212',
        building: 'Engineering Building',
        floor: '3rd Floor',
        room: 'Room 301',
        campus: 'Main Campus',
        facilities: ['Machine Shop', 'CAD Lab', 'Workshop'],
        programs: [{ name: 'B.Tech Mechanical Engineering', duration: '4 Years', type: 'Undergraduate' }],
        research_areas: ['Manufacturing', 'Thermodynamics', 'Robotics'],
        status: 'active',
        total_students: 150,
        total_faculty: 10,
        budget: 600000
      },
      { 
        id: 4, 
        department_code: 'CE', 
        name: 'Civil Engineering', 
        description: 'Civil Engineering Department with focus on infrastructure and construction', 
        established_year: 2020,
        email: 'ce@college.edu',
        phone_number: '9876543213',
        building: 'Engineering Building',
        floor: '4th Floor',
        room: 'Room 401',
        campus: 'Main Campus',
        facilities: ['Structural Lab', 'Survey Lab', 'Drawing Hall'],
        programs: [{ name: 'B.Tech Civil Engineering', duration: '4 Years', type: 'Undergraduate' }],
        research_areas: ['Structural Engineering', 'Transportation', 'Environmental'],
        status: 'active',
        total_students: 110,
        total_faculty: 7,
        budget: 450000
      },
      { 
        id: 5, 
        department_code: 'IT', 
        name: 'Information Technology', 
        description: 'Information Technology Department with focus on software and systems', 
        established_year: 2021,
        email: 'it@college.edu',
        phone_number: '9876543214',
        building: 'Technology Building',
        floor: '2nd Floor',
        room: 'Room 205',
        campus: 'Main Campus',
        facilities: ['Software Lab', 'Network Lab', 'Project Room'],
        programs: [{ name: 'B.Tech Information Technology', duration: '4 Years', type: 'Undergraduate' }],
        research_areas: ['Software Engineering', 'Networking', 'Database Systems'],
        status: 'active',
        total_students: 85,
        total_faculty: 5,
        budget: 350000
      },
      { 
        id: 6, 
        department_code: 'AI', 
        name: 'Artificial Intelligence', 
        description: 'AI Department with focus on machine learning and robotics', 
        established_year: 2022,
        email: 'ai@college.edu',
        phone_number: '9876543215',
        building: 'Innovation Center',
        floor: '1st Floor',
        room: 'Room 105',
        campus: 'Main Campus',
        facilities: ['AI Lab', 'Robotics Lab', 'Research Center'],
        programs: [{ name: 'B.Tech Artificial Intelligence', duration: '4 Years', type: 'Undergraduate' }],
        research_areas: ['Machine Learning', 'Computer Vision', 'Natural Language Processing'],
        status: 'active',
        total_students: 60,
        total_faculty: 4,
        budget: 300000
      }
    ];
    setDepartments(mockDepartments);
  }, []);

  // Convert departments data for ResponsiveTable
  const columns = [
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
      field: 'total_faculty',
      headerName: 'Faculty',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'total_students',
      headerName: 'Students',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'budget',
      headerName: 'Budget',
      render: (value) => `$${(value / 1000).toFixed(0)}K`,
      hideOnMobile: true,
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
          <Typography variant="body2">
            <strong>Location:</strong> {department.building}, {department.floor}, {department.room}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Campus:</strong> {department.campus}
          </Typography>
          <Typography variant="body2">
            <strong>Faculty Count:</strong> {department.total_faculty}
          </Typography>
          <Typography variant="body2">
            <strong>Student Count:</strong> {department.total_students}
          </Typography>
          <Typography variant="body2">
            <strong>Budget:</strong> ${(department.budget / 1000).toFixed(0)}K
          </Typography>
        </Grid>
      </Grid>
      {department.facilities && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Facilities:</strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {department.facilities.map((facility, index) => (
              <Chip key={index} label={facility} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      )}
      {department.research_areas && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Research Areas:</strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {department.research_areas.map((area, index) => (
              <Chip key={index} label={area} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );

  if (isLoading && !departments.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <PageHeader
        title="Department Management"
        subtitle="Manage academic departments and their information"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Management', path: '/principal/management' },
          { label: 'Departments', path: '/principal/departments' },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={handleCloseError}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Department Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={handleAdd}
          >
            Add Department
          </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Manage academic departments, their locations, and contact information.
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
          Resize your browser window to see the department data transform into different layouts!
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

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {departments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Departments
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
                <BusinessIcon sx={{ fontSize: 32, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {departments.filter(d => d.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Departments
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
                <BusinessIcon sx={{ fontSize: 32, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {departments.reduce((sum, d) => sum + d.total_faculty, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Faculty
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
                <BusinessIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {departments.reduce((sum, d) => sum + d.total_students, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Responsive Table */}
      <Card>
        <CardContent>
          {departments.length > 0 ? (
            <ResponsiveTable
              columns={columns}
              data={departments}
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              expandable={true}
              expandableContent={expandableDepartmentContent}
              emptyMessage="No departments found"
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Departments Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click "Add Department" to create your first department.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
        severity="success"
      />
    </Box>
  );
};
