import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  People,
  Add,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  CalendarToday,
  Work,
  School,
  Badge,
} from '@mui/icons-material';
import { principalService } from '../../services/principal.service';
import MainLayout from '../../layouts/MainLayout';

const Faculties = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [viewingFaculty, setViewingFaculty] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department_id: '',
    designation: '',
    specializations: [],
    qualifications: [],
    phone_number: '',
    joining_date: '',
    experience: [],
    publications: [],
    achievements: [],
    current_workload: 0,
    status: 'active'
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  // Load faculty and departments
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [facultyResponse, departmentsResponse] = await Promise.all([
        principalService.getFaculty(),
        principalService.getAvailableDepartments()
      ]);
      
      setFaculty(facultyResponse.data);
      setDepartments(departmentsResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_id) {
      errors.employee_id = 'Employee ID is required';
    }
    
    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!editingFaculty && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.department_id) {
      errors.department_id = 'Department is required';
    }
    
    if (!formData.designation) {
      errors.designation = 'Designation is required';
    }
    
    if (!formData.joining_date) {
      errors.joining_date = 'Joining date is required';
    }
    
    if (formData.phone_number && !/^[0-9]{10}$/.test(formData.phone_number)) {
      errors.phone_number = 'Phone number must be 10 digits';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = { ...formData };
      if (editingFaculty && !submitData.password) {
        delete submitData.password;
      }

      if (editingFaculty) {
        await principalService.updateFaculty(editingFaculty.id, submitData);
        setSuccess('Faculty updated successfully!');
      } else {
        await principalService.createFaculty(submitData);
        setSuccess('Faculty created successfully!');
      }
      
      setOpenDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save faculty');
    }
  };

  const handleEdit = (facultyMember) => {
    setEditingFaculty(facultyMember);
    setFormData({
      employee_id: facultyMember.employee_id,
      first_name: facultyMember.first_name,
      last_name: facultyMember.last_name,
      email: facultyMember.email,
      password: '',
      department_id: facultyMember.department_id,
      designation: facultyMember.designation,
      specializations: facultyMember.specializations || [],
      qualifications: facultyMember.qualifications || [],
      phone_number: facultyMember.phone_number || '',
      joining_date: facultyMember.joining_date,
      experience: facultyMember.experience || [],
      publications: facultyMember.publications || [],
      achievements: facultyMember.achievements || [],
      current_workload: facultyMember.current_workload || 0,
      status: facultyMember.status
    });
    setOpenDialog(true);
  };

  const handleView = (facultyMember) => {
    setViewingFaculty(facultyMember);
  };

  const handleDelete = async (facultyMember) => {
    if (window.confirm(`Are you sure you want to delete ${facultyMember.first_name} ${facultyMember.last_name}?`)) {
      try {
        await principalService.deleteFaculty(facultyMember.id);
        setSuccess('Faculty deleted successfully!');
        loadData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete faculty');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      department_id: '',
      designation: '',
      specializations: [],
      qualifications: [],
      phone_number: '',
      joining_date: '',
      experience: [],
      publications: [],
      achievements: [],
      current_workload: 0,
      status: 'active'
    });
    setValidationErrors({});
    setEditingFaculty(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Not assigned';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'on_leave': return 'warning';
      case 'inactive': return 'error';
      case 'terminated': return 'error';
      default: return 'default';
    }
  };

  const getFullName = (facultyMember) => {
    return `${facultyMember.first_name} ${facultyMember.last_name}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontSize: isMobile ? '2rem' : '3rem',
            }}
          >
            Faculty Management
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Manage faculty members and their assignments
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card
              elevation={3}
              sx={{
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(233, 69, 96, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {faculty.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Faculty
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card
              elevation={3}
              sx={{
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(52, 152, 219, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {faculty.filter(f => f.status === 'on_leave').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      On Leave
                    </Typography>
                  </Box>
                  <Work sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Faculty Table */}
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560' }}>
                Faculty List
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenDialog}
                sx={{
                  background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                  },
                }}
              >
                Add Faculty
              </Button>
            </Box>

            {isMobile ? (
              // Mobile view - Cards
              <Grid container spacing={2}>
                {faculty.map((facultyMember) => (
                  <Grid item xs={12} key={facultyMember.id}>
                    <Card
                      elevation={2}
                      sx={{
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(233, 69, 96, 0.2)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e94560' }}>
                              {getFullName(facultyMember)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {facultyMember.employee_id}
                            </Typography>
                          </Box>
                          <Chip
                            label={facultyMember.status}
                            color={getStatusColor(facultyMember.status)}
                            size="small"
                          />
                        </Box>
                        
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Badge sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                            <Typography variant="body2">{facultyMember.designation}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                            <Typography variant="body2">{facultyMember.email}</Typography>
                          </Box>
                          {facultyMember.phone_number && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Phone sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                              <Typography variant="body2">{facultyMember.phone_number}</Typography>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <School sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                            <Typography variant="body2">{getDepartmentName(facultyMember.department_id)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                            <Typography variant="body2">Joined: {new Date(facultyMember.joining_date).toLocaleDateString()}</Typography>
                          </Box>
                        </Stack>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleView(facultyMember)}
                            sx={{ color: '#3498db' }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(facultyMember)}
                            sx={{ color: '#f39c12' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(facultyMember)}
                            sx={{ color: '#e74c3c' }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // Desktop view - Table
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Faculty</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee ID</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {faculty.map((facultyMember) => (
                      <TableRow
                        key={facultyMember.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(233, 69, 96, 0.05)',
                          },
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {getFullName(facultyMember)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {facultyMember.designation}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={facultyMember.employee_id} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getDepartmentName(facultyMember.department_id)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{facultyMember.email}</Typography>
                            {facultyMember.phone_number && (
                              <Typography variant="body2" color="text.secondary">
                                {facultyMember.phone_number}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={facultyMember.status}
                            color={getStatusColor(facultyMember.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleView(facultyMember)}
                              sx={{ color: '#3498db' }}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(facultyMember)}
                              sx={{ color: '#f39c12' }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(facultyMember)}
                              sx={{ color: '#e74c3c' }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpenDialog}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
              },
            }}
          >
            <Add />
          </Fab>
        )}

        {/* Create/Edit Faculty Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
            color: 'white'
          }}>
            {editingFaculty ? 'Edit Faculty' : 'Create New Faculty'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  error={!!validationErrors.employee_id}
                  helperText={validationErrors.employee_id}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  error={!!validationErrors.designation}
                  helperText={validationErrors.designation}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  error={!!validationErrors.first_name}
                  helperText={validationErrors.first_name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  error={!!validationErrors.last_name}
                  helperText={validationErrors.last_name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  error={!!validationErrors.phone_number}
                  helperText={validationErrors.phone_number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password || (editingFaculty ? 'Leave blank to keep current password' : '')}
                  required={!editingFaculty}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={handleInputChange}
                  error={!!validationErrors.joining_date}
                  helperText={validationErrors.joining_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    label="Department"
                    error={!!validationErrors.department_id}
                  >
                    <MenuItem value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.name} ({department.department_code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="on_leave">On Leave</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="terminated">Terminated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Workload (hours/week)"
                  name="current_workload"
                  type="number"
                  value={formData.current_workload}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                },
              }}
            >
              {editingFaculty ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Faculty Dialog */}
        <Dialog
          open={!!viewingFaculty}
          onClose={() => setViewingFaculty(null)}
          maxWidth="md"
          fullWidth
        >
          {viewingFaculty && (
            <>
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                color: 'white'
              }}>
                Faculty Details
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560', mb: 2 }}>
                      {getFullName(viewingFaculty)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Employee ID</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingFaculty.employee_id}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip
                      label={viewingFaculty.status}
                      color={getStatusColor(viewingFaculty.status)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingFaculty.email}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingFaculty.phone_number || 'Not provided'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingFaculty.designation}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {getDepartmentName(viewingFaculty.department_id)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Joining Date</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(viewingFaculty.joining_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Current Workload</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingFaculty.current_workload || 0} hours/week
                    </Typography>
                  </Grid>
                  
                  {viewingFaculty.specializations && viewingFaculty.specializations.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Specializations</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {viewingFaculty.specializations.map((spec, index) => (
                          <Chip key={index} label={spec} size="small" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  
                  {viewingFaculty.last_login_at && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Last Login</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {new Date(viewingFaculty.last_login_at).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setViewingFaculty(null)} color="inherit">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewingFaculty(null);
                    handleEdit(viewingFaculty);
                  }}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                    },
                  }}
                >
                  Edit
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default Faculties;
