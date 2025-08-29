import React, { useState, useEffect, Fragment } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid,
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
  People as PeopleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import {
  FacultyForm,
  DepartmentForm,
} from '../../components/forms';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`management-tabpanel-${index}`}
      aria-labelledby={`management-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Management = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // Data states - Only Principal management data
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAdd = (type) => {
    setFormType(type);
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item, type) => {
    setFormType(type);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setIsLoading(true);
        
        // Remove item from appropriate state
        switch (type) {
          case 'department':
            setDepartments(prev => prev.filter(item => item.id !== id));
            break;
          case 'faculty':
            setFaculty(prev => prev.filter(item => item.id !== id));
            break;
          default:
            break;
        }
        
        setSuccessMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      
      if (editingItem) {
        // Update existing item
        const updatedItem = { ...editingItem, ...values };
        
        switch (formType) {
          case 'department':
            setDepartments(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
            break;
          case 'faculty':
            setFaculty(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
            break;
          default:
            break;
        }
        
        setSuccessMessage(`${formType.charAt(0).toUpperCase() + formType.slice(1)} updated successfully`);
      } else {
        // Create new item
        const newItem = { 
          ...values, 
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        
        switch (formType) {
          case 'department':
            setDepartments(prev => [...prev, newItem]);
            break;
          case 'faculty':
            setFaculty(prev => [...prev, newItem]);
            break;
          default:
            break;
        }
        
        setSuccessMessage(`${formType.charAt(0).toUpperCase() + formType.slice(1)} created successfully`);
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
      setFormType(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setFormType(null);
    setEditingItem(null);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  const handleCloseError = () => {
    setError(null);
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
      },
      { 
        id: 4, 
        department_code: 'MATH', 
        name: 'Mathematics', 
        description: 'Mathematics Department offering pure and applied mathematics', 
        established_year: 2020,
        email: 'math@college.edu',
        phone_number: '9876543213',
        location: { building: 'Main Building', floor: '3rd Floor', room: 'Room 301', campus: 'Main Campus' },
        facilities: ['Computer Lab', 'Library', 'Study Room'],
        programs: [{ name: 'B.Sc Mathematics', duration: '3 Years', type: 'Undergraduate' }],
        research_areas: ['Algebra', 'Analysis', 'Applied Mathematics'],
        status: 'active',
        total_students: 75,
        total_faculty: 4,
        budget: 200000
      },
      { 
        id: 5, 
        department_code: 'PHY', 
        name: 'Physics', 
        description: 'Physics Department with research in quantum mechanics', 
        established_year: 2020,
        email: 'phy@college.edu',
        phone_number: '9876543214',
        location: { building: 'Science Building', floor: '1st Floor', room: 'Room 101', campus: 'Main Campus' },
        facilities: ['Physics Lab', 'Research Lab', 'Seminar Hall'],
        programs: [{ name: 'B.Sc Physics', duration: '3 Years', type: 'Undergraduate' }],
        research_areas: ['Quantum Mechanics', 'Condensed Matter', 'Optics'],
        status: 'active',
        total_students: 60,
        total_faculty: 3,
        budget: 150000
      },
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
        first_name: 'Robert', 
        last_name: 'Johnson', 
        designation: 'Professor', 
        department_id: 2, 
        email: 'robert.johnson@college.edu', 
        phone_number: '9876543203', 
        specializations: ['Power Systems', 'Control Engineering'],
        qualifications: [{ degree: 'Ph.D.', institution: 'IIT Bombay', year: 2015, percentage: '88%' }],
        joining_date: '2019-01-01', 
        experience: [{ position: 'Associate Professor', organization: 'IIT Madras', from_date: '2015-01-01', to_date: '2018-12-31', description: 'Research in power systems' }],
        publications: [{ title: 'Power System Analysis', journal: 'Electrical Engineering Journal', year: 2019, doi: '10.1000/ghi789' }],
        achievements: [{ title: 'Excellence in Teaching', year: 2019, description: 'Awarded for outstanding teaching' }],
        current_workload: 20,
        status: 'active'
      },
      { 
        id: 4, 
        employee_id: 'MATH001', 
        first_name: 'Sarah', 
        last_name: 'Wilson', 
        designation: 'Assistant Professor', 
        department_id: 4, 
        email: 'sarah.wilson@college.edu', 
        phone_number: '9876543204', 
        specializations: ['Algebra', 'Number Theory'],
        qualifications: [{ degree: 'Ph.D.', institution: 'ISI Kolkata', year: 2022, percentage: '90%' }],
        joining_date: '2022-01-01', 
        experience: [{ position: 'Research Fellow', organization: 'ISI Kolkata', from_date: '2019-01-01', to_date: '2021-12-31', description: 'Research in number theory' }],
        publications: [{ title: 'Modern Algebra', journal: 'Mathematics Journal', year: 2022, doi: '10.1000/jkl012' }],
        achievements: [{ title: 'Research Fellowship', year: 2022, description: 'Awarded for mathematical research' }],
        current_workload: 14,
        status: 'active'
      },
    ]);
  }, []);

  // Only Principal management tabs
  const tabs = [
    { label: 'Departments', icon: <BusinessIcon />, data: departments, type: 'department' },
    { label: 'Faculty', icon: <PeopleIcon />, data: faculty, type: 'faculty' },
  ];

  const getColumns = (type) => {
    const baseColumns = [
      {
        id: 'actions',
        label: 'Actions',
        minWidth: 120,
        format: (value, row) => (
          <Box>
            <IconButton
              size="small"
              onClick={() => handleEdit(row, type)}
              title="Edit"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDelete(row.id, type)}
              title="Delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ];

    switch (type) {
      case 'department':
        return [
          { id: 'department_code', label: 'Code', minWidth: 100 },
          { id: 'name', label: 'Name', minWidth: 150 },
          { id: 'description', label: 'Description', minWidth: 200 },
          { id: 'established_year', label: 'Established', minWidth: 120 },
          { id: 'email', label: 'Email', minWidth: 200 },
          { id: 'total_students', label: 'Students', minWidth: 100 },
          { id: 'total_faculty', label: 'Faculty', minWidth: 100 },
          { id: 'status', label: 'Status', minWidth: 100, format: (value) => (
            <Chip label={value} color={value === 'active' ? 'success' : 'default'} size="small" />
          )},
          ...baseColumns,
        ];
      case 'faculty':
        return [
          { id: 'employee_id', label: 'Employee ID', minWidth: 120 },
          { id: 'first_name', label: 'First Name', minWidth: 120 },
          { id: 'last_name', label: 'Last Name', minWidth: 120 },
          { id: 'designation', label: 'Designation', minWidth: 150 },
          { id: 'email', label: 'Email', minWidth: 200 },
          { id: 'department_id', label: 'Department', minWidth: 150, format: (value) => departments.find(d => d.id === value)?.name || value },
          { id: 'specializations', label: 'Specializations', minWidth: 200, format: (value) => value?.slice(0, 2).join(', ') + (value?.length > 2 ? '...' : '') },
          { id: 'status', label: 'Status', minWidth: 100, format: (value) => (
            <Chip label={value} color={value === 'active' ? 'success' : 'warning'} size="small" />
          )},
          ...baseColumns,
        ];
      default:
        return baseColumns;
    }
  };

  const renderForm = () => {
    if (!isFormOpen || !formType) return null;

    const commonProps = {
      open: isFormOpen,
      onClose: handleFormClose,
      onSubmit: handleFormSubmit,
      initialValues: editingItem,
      isLoading,
    };

    switch (formType) {
      case 'department':
        return <DepartmentForm {...commonProps} faculty={faculty} />;
      case 'faculty':
        return <FacultyForm {...commonProps} departments={departments} />;
      default:
        return null;
    }
  };

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
        subtitle="Manage departments and faculty members"
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

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="principal management tabs">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.type}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.icon}
                    {tab.label}
                  </Box>
                }
                id={`management-tab-${index}`}
                aria-controls={`management-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {tabs.map((tab, index) => (
          <TabPanel key={tab.type} value={activeTab} index={index}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {tab.label} ({tab.data?.length || 0})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAdd(tab.type)}
              >
                Add {tab.label.slice(0, -1)}
              </Button>
            </Box>

            {tab.data?.length > 0 ? (
              <DataTable
                columns={getColumns(tab.type)}
                data={tab.data}
                totalCount={tab.data.length}
                page={0}
                rowsPerPage={10}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No {tab.label.toLowerCase()} found. Click "Add {tab.label.slice(0, -1)}" to get started.
                </Typography>
              </Box>
            )}
          </TabPanel>
        ))}
      </Card>

      {renderForm()}

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
