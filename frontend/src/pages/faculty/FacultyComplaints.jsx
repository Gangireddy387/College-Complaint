import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ResponsiveTable } from '../../components/shared/ResponsiveTable';

const FacultyComplaints = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data - replace with actual API calls
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      studentId: 'STU001',
      studentName: 'John Doe',
      subject: 'Data Structures',
      complaintType: 'Academic',
      title: 'Assignment Grading Issue',
      description: 'I believe my assignment was graded unfairly. I followed all the requirements but received a lower grade than expected.',
      priority: 'Medium',
      status: 'Pending',
      date: '2023-12-15',
      time: '14:30',
      facultyResponse: '',
      resolution: '',
      attachments: ['assignment.pdf', 'grading_rubric.pdf'],
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: 'Jane Smith',
      subject: 'Algorithms',
      complaintType: 'Technical',
      title: 'Lab Equipment Not Working',
      description: 'The computers in Lab 102 are not functioning properly. Several machines are showing error messages.',
      priority: 'High',
      status: 'In Progress',
      date: '2023-12-14',
      time: '10:15',
      facultyResponse: 'I have reported this to the IT department. They are working on fixing the issue.',
      resolution: '',
      attachments: ['error_screenshot.png'],
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      subject: 'Database Systems',
      complaintType: 'Academic',
      title: 'Clarification Needed on Project',
      description: 'I need clarification on the project requirements. The instructions are not clear enough.',
      priority: 'Low',
      status: 'Resolved',
      date: '2023-12-13',
      time: '16:45',
      facultyResponse: 'I have provided detailed clarification on the project requirements.',
      resolution: 'Student received clarification and is now proceeding with the project.',
      attachments: ['project_requirements.pdf'],
    },
    {
      id: 4,
      studentId: 'STU004',
      studentName: 'Sarah Wilson',
      subject: 'Web Development',
      complaintType: 'Technical',
      title: 'Server Access Issues',
      description: 'I cannot access the development server for our web project. Getting connection timeout errors.',
      priority: 'High',
      status: 'Pending',
      date: '2023-12-12',
      time: '09:30',
      facultyResponse: '',
      resolution: '',
      attachments: ['error_log.txt'],
    },
  ]);

  // Convert complaints data for ResponsiveTable
  const complaintColumns = [
    {
      field: 'studentName',
      headerName: 'Student Name',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'title',
      headerName: 'Complaint Title',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'complaintType',
      headerName: 'Type',
      render: (value) => (
        <Chip
          label={value}
          size="small"
          color={value === 'Academic' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      render: (value) => (
        <Chip
          label={value}
          size="small"
          color={value === 'High' ? 'error' : value === 'Medium' ? 'warning' : 'success'}
          variant="filled"
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
          color={value === 'Resolved' ? 'success' : value === 'In Progress' ? 'warning' : 'default'}
          variant="outlined"
        />
      ),
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'date',
      headerName: 'Date',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    {
      field: 'time',
      headerName: 'Time',
      hideOnMobile: true,
      hideOnTablet: false,
    },
  ];

  const handleComplaintRowClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsViewDialogOpen(true);
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setIsViewDialogOpen(true);
  };

  const handleEditComplaint = (complaint) => {
    console.log('Edit complaint:', complaint);
    // Open edit dialog
  };

  const handleDeleteComplaint = (complaint) => {
    console.log('Delete complaint:', complaint);
    // Show confirmation dialog
  };

  const expandableComplaintContent = (complaint) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Complaint Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Student ID:</strong> {complaint.studentId}
          </Typography>
          <Typography variant="body2">
            <strong>Date:</strong> {complaint.date}
          </Typography>
          <Typography variant="body2">
            <strong>Time:</strong> {complaint.time}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Type:</strong> {complaint.complaintType}
          </Typography>
          <Typography variant="body2">
            <strong>Priority:</strong> {complaint.priority}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {complaint.status}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Description:</strong> {complaint.description}
        </Typography>
      </Box>
      {complaint.facultyResponse && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="primary.main">
            <strong>Faculty Response:</strong> {complaint.facultyResponse}
          </Typography>
        </Box>
      )}
      {complaint.resolution && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="success.main">
            <strong>Resolution:</strong> {complaint.resolution}
          </Typography>
        </Box>
      )}
      {complaint.attachments && complaint.attachments.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Attachments:</strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {complaint.attachments.map((attachment, index) => (
              <Chip key={index} label={attachment} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );

  // Filter complaints based on selected tab
  const getFilteredComplaints = () => {
    let filtered = complaints;
    
    if (selectedTab === 1) {
      filtered = filtered.filter(complaint => complaint.status === 'Pending');
    } else if (selectedTab === 2) {
      filtered = filtered.filter(complaint => complaint.status === 'In Progress');
    } else if (selectedTab === 3) {
      filtered = filtered.filter(complaint => complaint.status === 'Resolved');
    }

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter);
    }

    return filtered;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Student Complaints
              </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setIsAddDialogOpen(true)}
            >
            Add Response
            </Button>
        </Box>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
          Manage and respond to student complaints and feedback.
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
          Resize your browser window to see the complaints data transform into different layouts!
        </Typography>
        </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {complaints.filter(c => c.status === 'Pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                    Pending
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
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <InfoIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {complaints.filter(c => c.status === 'In Progress').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                    In Progress
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
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
              {complaints.filter(c => c.status === 'Resolved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolved
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
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <ErrorIcon />
                </Avatar>
                    <Box>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {complaints.filter(c => c.priority === 'High').length}
                      </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
                      </Typography>
                    </Box>
                    </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="All Complaints" />
          <Tab label="Pending" />
          <Tab label="In Progress" />
          <Tab label="Resolved" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Filters */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filter by Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    label="Filter by Priority"
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Responsive Table */}
          <ResponsiveTable
            columns={complaintColumns}
            data={getFilteredComplaints()}
            onRowClick={handleComplaintRowClick}
            onView={handleViewComplaint}
            onEdit={handleEditComplaint}
            onDelete={handleDeleteComplaint}
            expandable={true}
            expandableContent={expandableComplaintContent}
            emptyMessage="No complaints found"
          />
        </Box>
          </Paper>

      {/* View Complaint Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Complaint Details
        </DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedComplaint.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Student:</strong> {selectedComplaint.studentName} ({selectedComplaint.studentId})
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Subject:</strong> {selectedComplaint.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Date:</strong> {selectedComplaint.date} at {selectedComplaint.time}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {selectedComplaint.description}
                </Typography>
              </Box>
              {selectedComplaint.facultyResponse && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="primary.main">
                    Faculty Response:
                  </Typography>
                  <Typography variant="body2">
                    {selectedComplaint.facultyResponse}
                  </Typography>
                </Box>
              )}
              {selectedComplaint.resolution && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="success.main">
                    Resolution:
                  </Typography>
                  <Typography variant="body2">
                    {selectedComplaint.resolution}
                  </Typography>
          </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          <Button variant="contained">Respond</Button>
        </DialogActions>
      </Dialog>

      {/* Add Response Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Response</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Response form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyComplaints;
