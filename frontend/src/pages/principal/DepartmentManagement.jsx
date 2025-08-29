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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';

export const DepartmentManagement = () => {
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
    ];
    
    console.log('Setting departments:', mockDepartments);
    setDepartments(mockDepartments);
  }, []);

  const columns = [
    {
      id: 'department_code',
      label: 'Code',
      minWidth: 100,
      format: (value) => (
        <Chip 
          label={value} 
          color="primary" 
          variant="outlined"
          size="small"
        />
      )
    },
    {
      id: 'name',
      label: 'Department Name',
      minWidth: 200,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.description}
          </Typography>
        </Box>
      )
    },
    {
      id: 'location',
      label: 'Location',
      minWidth: 200,
      format: (value) => (
        <Box>
          <Typography variant="body2">
            {value.building}, {value.floor}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {value.room}, {value.campus}
          </Typography>
        </Box>
      )
    },
    {
      id: 'contact',
      label: 'Contact',
      minWidth: 200,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{row.email}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.phone_number}
          </Typography>
        </Box>
      )
    },
    {
      id: 'stats',
      label: 'Statistics',
      minWidth: 150,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">
            Students: {row.total_students}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Faculty: {row.total_faculty}
          </Typography>
        </Box>
      )
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value) => (
        <Chip 
          label={value} 
          color={value === 'active' ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      format: (value, row) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

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

      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Departments ({departments.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage academic departments, their locations, and contact information
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              size="large"
            >
              Add Department
            </Button>
          </Box>

          {departments.length > 0 ? (
            <DataTable
              columns={columns}
              data={departments}
              totalCount={departments.length}
              page={0}
              rowsPerPage={10}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              isLoading={isLoading}
              error={error}
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
