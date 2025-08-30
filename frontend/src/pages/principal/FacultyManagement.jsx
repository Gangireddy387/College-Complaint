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
  Avatar,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

export const FacultyManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { user } = useSelector((state) => state.auth);

  const handleAdd = () => {
    navigate('/principal/faculty/add');
  };

  const handleEdit = (item) => {
    // For now, just show an alert. You can implement edit functionality later
    alert('Edit functionality will be implemented in a separate page');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        setIsLoading(true);
        setFaculty(prev => prev.filter(item => item.id !== id));
        setSuccessMessage('Faculty member deleted successfully');
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

  const handleRowClick = (facultyMember) => {
    console.log('Faculty clicked:', facultyMember);
    // Navigate to faculty details
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown';
  };

  // Mock data for departments and faculty
  useEffect(() => {
    setDepartments([
      { id: 1, name: 'Computer Science', department_code: 'CS' },
      { id: 2, name: 'Electrical Engineering', department_code: 'EE' },
      { id: 3, name: 'Mechanical Engineering', department_code: 'ME' },
      { id: 4, name: 'Civil Engineering', department_code: 'CE' },
      { id: 5, name: 'Information Technology', department_code: 'IT' },
      { id: 6, name: 'Artificial Intelligence', department_code: 'AI' }
    ]);
    
    setFaculty([
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
        qualifications: 'Ph.D. Computer Science, IIT Delhi',
        joining_date: '2015-08-15', 
        experience: '8 years',
        publications: 15,
        achievements: 'Best Paper Award 2021',
        current_workload: 12,
        status: 'active',
        avatar: 'JS'
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
        qualifications: 'Ph.D. Information Systems, Stanford University',
        joining_date: '2018-01-10', 
        experience: '5 years',
        publications: 12,
        achievements: 'Excellence in Teaching Award 2022',
        current_workload: 10,
        status: 'active',
        avatar: 'SJ'
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
        qualifications: 'Ph.D. Electrical Engineering, MIT',
        joining_date: '2020-06-01', 
        experience: '3 years',
        publications: 8,
        achievements: 'Young Researcher Award 2023',
        current_workload: 8,
        status: 'active',
        avatar: 'MB'
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
        qualifications: 'Ph.D. Power Engineering, UC Berkeley',
        joining_date: '2012-03-20', 
        experience: '11 years',
        publications: 25,
        achievements: 'Distinguished Faculty Award 2020',
        current_workload: 14,
        status: 'active',
        avatar: 'ED'
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
        qualifications: 'Ph.D. Mechanical Engineering, Georgia Tech',
        joining_date: '2016-09-15', 
        experience: '7 years',
        publications: 18,
        achievements: 'Research Excellence Award 2021',
        current_workload: 11,
        status: 'active',
        avatar: 'RW'
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
        qualifications: 'Ph.D. Robotics, Carnegie Mellon',
        joining_date: '2021-01-10', 
        experience: '2 years',
        publications: 6,
        achievements: 'Innovation Award 2023',
        current_workload: 9,
        status: 'active',
        avatar: 'LA'
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
        qualifications: 'Ph.D. Civil Engineering, UCLA',
        joining_date: '2010-07-01', 
        experience: '13 years',
        publications: 30,
        achievements: 'Lifetime Achievement Award 2022',
        current_workload: 13,
        status: 'active',
        avatar: 'DM'
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
        qualifications: 'Ph.D. Computer Science, University of Washington',
        joining_date: '2017-11-05', 
        experience: '6 years',
        publications: 16,
        achievements: 'Cybersecurity Excellence Award 2023',
        current_workload: 10,
        status: 'active',
        avatar: 'JT'
      }
    ]);
  }, []);

  // Convert faculty data for ResponsiveTable
  const columns = [
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
      render: (value) => (
        <Chip
          label={`${value} hrs/week`}
          size="small"
          color={value > 18 ? 'warning' : value > 12 ? 'info' : 'success'}
          variant="filled"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'publications',
      headerName: 'Publications',
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

  const expandableFacultyContent = (facultyMember) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Faculty Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Email:</strong> {facultyMember.email}
          </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {facultyMember.phone_number}
          </Typography>
          <Typography variant="body2">
            <strong>Department:</strong> {facultyMember.department_name}
          </Typography>
          <Typography variant="body2">
            <strong>Specializations:</strong> {facultyMember.specializations}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Qualifications:</strong> {facultyMember.qualifications}
          </Typography>
          <Typography variant="body2">
            <strong>Experience:</strong> {facultyMember.experience}
          </Typography>
          <Typography variant="body2">
            <strong>Publications:</strong> {facultyMember.publications}
          </Typography>
          <Typography variant="body2">
            <strong>Achievements:</strong> {facultyMember.achievements}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  if (isLoading && !faculty.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <PageHeader
        title="Faculty Management"
        subtitle="Manage faculty members and their information"
        breadcrumbs={[
          { label: 'Home', path: '/principal/dashboard' },
          { label: 'Management', path: '/principal/management' },
          { label: 'Faculty', path: '/principal/faculty' },
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
            Faculty Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={handleAdd}
          >
            Add Faculty Member
          </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Manage faculty members, their specializations, and workload.
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
          Resize your browser window to see the faculty data transform into different layouts!
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
                <PeopleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {faculty.length}
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
                <PeopleIcon sx={{ fontSize: 32, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {faculty.filter(f => f.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Faculty
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
                <PeopleIcon sx={{ fontSize: 32, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {faculty.filter(f => f.designation === 'Professor').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Professors
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
                <PeopleIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {Math.round(faculty.reduce((sum, f) => sum + f.current_workload, 0) / faculty.length)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Workload (hrs/week)
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
          {faculty.length > 0 ? (
            <ResponsiveTable
              columns={columns}
              data={faculty}
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              expandable={true}
              expandableContent={expandableFacultyContent}
              emptyMessage="No faculty members found"
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Faculty Members Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click "Add Faculty Member" to add your first faculty member.
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
