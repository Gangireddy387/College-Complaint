import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

export const StudentList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [students] = useState([
  {
    id: 1,
      name: 'John Doe',
    email: 'john.doe@college.edu',
      department: 'Computer Science',
    semester: 3,
    status: 'active',
      attendance: 85,
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY',
  },
  {
    id: 2,
      name: 'Jane Smith',
    email: 'jane.smith@college.edu',
      department: 'Electrical Engineering',
      semester: 2,
    status: 'active',
      attendance: 92,
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA',
  },
  {
    id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@college.edu',
      department: 'Mechanical Engineering',
      semester: 4,
      status: 'inactive',
      attendance: 78,
      phone: '+1 (555) 345-6789',
      address: '789 Pine St, Chicago, IL',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@college.edu',
      department: 'Computer Science',
      semester: 1,
      status: 'active',
      attendance: 95,
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, Boston, MA',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@college.edu',
      department: 'Mathematics',
      semester: 3,
    status: 'active',
      attendance: 88,
      phone: '+1 (555) 567-8901',
      address: '654 Maple Dr, Seattle, WA',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@college.edu',
      department: 'Physics',
      semester: 2,
      status: 'active',
      attendance: 91,
      phone: '+1 (555) 678-9012',
      address: '987 Cedar Ln, Austin, TX',
    },
  ]);

  const columns = [
    {
      field: 'name',
      headerName: 'Student Name',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'email',
      headerName: 'Email Address',
      hideOnMobile: true, // Hide on mobile to save space
      hideOnTablet: false,
    },
    {
      field: 'department',
      headerName: 'Department',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'semester',
      headerName: 'Semester',
      render: (value) => (
        <Chip
          label={`Sem ${value}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
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
    {
      field: 'attendance',
      headerName: 'Attendance %',
      render: (value) => (
        <Chip
          label={`${value}%`}
          size="small"
          color={value >= 90 ? 'success' : value >= 80 ? 'warning' : 'error'}
          variant="filled"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
  ];

  const handleView = (student) => {
    console.log('View student:', student);
    // Navigate to student details page
  };

  const handleEdit = (student) => {
    console.log('Edit student:', student);
    // Open edit modal or navigate to edit page
  };

  const handleDelete = (student) => {
    console.log('Delete student:', student);
    // Show confirmation dialog
  };

  const handleRowClick = (student) => {
    console.log('Row clicked:', student);
    // Navigate to student profile
  };

  const expandableContent = (student) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Email:</strong> {student.email}
          </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {student.phone}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Department:</strong> {student.department}
          </Typography>
          <Typography variant="body2">
            <strong>Address:</strong> {student.address}
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
          Student Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
        >
          Add Student
        </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Manage all students in the college. The table below automatically adapts to different screen sizes.
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
            isTablet ? 'Tablet Grid View (2-Column Cards)' :
            'Desktop Table View (Full Table)'
          }
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Resize your browser window to see the table transform into different layouts!
        </Typography>
        </Alert>

      {/* Responsive Table */}
      <ResponsiveTable
        columns={columns}
        data={students}
        onRowClick={handleRowClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        expandable={true}
        expandableContent={expandableContent}
        emptyMessage="No students found"
        sx={{ 
          mt: 2,
        }}
      />

      {/* Responsive Behavior Info */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Responsive Table Behavior
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Desktop View
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Screen Size:</strong> ≥1200px
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Layout:</strong> Traditional table with headers
        </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Features:</strong> All columns visible, hover effects, action buttons in separate column
                      </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Tablet View
                          </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Screen Size:</strong> 900-1200px
                          </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Layout:</strong> 2-column card grid
                      </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Features:</strong> Larger cards, some columns hidden, action buttons at bottom
                      </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
                <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Mobile View
                      </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Screen Size:</strong> &lt;900px
                      </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Layout:</strong> Single column card grid
                    </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Features:</strong> Compact cards, minimal columns, touch-friendly buttons
                    </Typography>
                </CardContent>
              </Card>
            </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>How it works:</strong> The ResponsiveTable component automatically detects screen size and switches between table and grid layouts. 
            No manual configuration needed - it adapts seamlessly to provide the best user experience on any device.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
