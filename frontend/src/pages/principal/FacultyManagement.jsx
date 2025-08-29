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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';

export const FacultyManagement = () => {
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
      { id: 4, name: 'Mathematics', department_code: 'MATH' },
      { id: 5, name: 'Physics', department_code: 'PHY' }
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

  const columns = [
    {
      id: 'employee_id',
      label: 'Employee ID',
      minWidth: 120,
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
      label: 'Faculty Name',
      minWidth: 200,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            {row.first_name.charAt(0)}{row.last_name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {row.first_name} {row.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.designation}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      format: (value, row) => (
        <Chip 
          label={getDepartmentName(row.department_id)} 
          color="secondary" 
          variant="outlined"
          size="small"
        />
      )
    },
    {
      id: 'specializations',
      label: 'Specializations',
      minWidth: 200,
      format: (value) => (
        <Box>
          {value?.map((spec, index) => (
            <Chip 
              key={index}
              label={spec} 
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
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
      id: 'workload',
      label: 'Workload',
      minWidth: 120,
      format: (value, row) => (
        <Chip 
          label={`${row.current_workload} hrs/week`} 
          color={row.current_workload > 18 ? 'warning' : 'success'}
          size="small"
        />
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

  if (isLoading && !faculty.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
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

      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Faculty Members ({faculty.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage faculty members, their specializations, and workload
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              size="large"
            >
              Add Faculty Member
            </Button>
          </Box>

          {faculty.length > 0 ? (
            <DataTable
              columns={columns}
              data={faculty}
              totalCount={faculty.length}
              page={0}
              rowsPerPage={10}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              isLoading={isLoading}
              error={error}
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
