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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  School,
  Add,
  Edit,
  Delete,
  Visibility,
  Person,
  Email,
  Phone,
} from '@mui/icons-material';
import { principalService } from '../../services/principal.service';
import MainLayout from '../../layouts/MainLayout';

const Departments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [viewingDepartment, setViewingDepartment] = useState(null);
  const [openHODDialog, setOpenHODDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedHOD, setSelectedHOD] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    department_code: '',
    name: '',
    description: '',
    email: '',
    phone_number: '',
    established_year: new Date().getFullYear()
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  // Load departments and faculty
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [departmentsResponse, facultyResponse] = await Promise.all([
        principalService.getDepartments(),
        principalService.getFaculty()
      ]);
      
      setDepartments(departmentsResponse.data);
      setFaculty(facultyResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load departments');
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
    
    if (!formData.department_code) {
      errors.department_code = 'Department code is required';
    }
    
    if (!formData.name) {
      errors.name = 'Department name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.established_year) {
      errors.established_year = 'Establishment year is required';
    } else if (formData.established_year < 1900 || formData.established_year > new Date().getFullYear()) {
      errors.established_year = 'Please enter a valid establishment year';
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
      if (editingDepartment) {
        await principalService.updateDepartment(editingDepartment.id, formData);
        setSuccess('Department updated successfully!');
      } else {
        await principalService.createDepartment(formData);
        setSuccess('Department created successfully!');
      }
      
      setOpenDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save department');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      department_code: department.department_code,
      name: department.name,
      description: department.description || '',
      email: department.email,
      phone_number: department.phone_number || '',
      established_year: department.established_year || new Date().getFullYear()
    });
    setOpenDialog(true);
  };

  const handleView = (department) => {
    setViewingDepartment(department);
  };

  const handleDelete = async (department) => {
    if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
      try {
        await principalService.deleteDepartment(department.id);
        setSuccess('Department deleted successfully!');
        loadData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete department');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      department_code: '',
      name: '',
      description: '',
      email: '',
      phone_number: '',
      established_year: new Date().getFullYear()
    });
    setValidationErrors({});
    setEditingDepartment(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const getHODName = (hodId) => {
    const hod = faculty.find(f => f.id === hodId);
    return hod ? `${hod.first_name} ${hod.last_name}` : 'Not assigned';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const handleAssignHOD = (department) => {
    setSelectedDepartment(department);
    setSelectedHOD('');
    setOpenHODDialog(true);
  };

  const handleHODSubmit = async () => {
    if (!selectedHOD) {
      return;
    }

    try {
      await principalService.updateDepartment(selectedDepartment.id, {
        hod_id: selectedHOD
      });
      setSuccess('HOD assigned successfully!');
      setOpenHODDialog(false);
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign HOD');
    }
  };

  const getDepartmentFaculty = (departmentId) => {
    console.log('Faculty data:', faculty);
    console.log('Department ID:', departmentId);
    const filteredFaculty = faculty.filter(f => f.department?.id === departmentId && f.status === 'active');
    console.log('Filtered faculty:', filteredFaculty);
    return filteredFaculty;
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
            Departments Management
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Manage college departments and their configurations
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
          <Grid item xs={12} sm={6} md={4}>
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
                      {departments.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Departments
                    </Typography>
                  </Box>
                  <School sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
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
                      {departments.reduce((sum, d) => sum + (d.total_faculty || 0), 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Faculty
                    </Typography>
                  </Box>
                  <Person sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={3}
              sx={{
                background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(155, 89, 182, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {departments.reduce((sum, d) => sum + (d.total_students || 0), 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Students
                    </Typography>
                  </Box>
                  <School sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Departments Table */}
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560' }}>
                Departments List
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
                Add Department
              </Button>
            </Box>

            {isMobile ? (
              // Mobile view - Cards
              <Grid container spacing={2}>
                {departments.map((department) => (
                  <Grid item xs={12} key={department.id}>
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
                              {department.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Code: {department.department_code}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                            <Typography variant="body2">{department.email}</Typography>
                          </Box>
                          {department.phone_number && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Phone sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                              <Typography variant="body2">{department.phone_number}</Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                            <Typography variant="body2">HOD: {getHODName(department.hod_id)}</Typography>
                          </Box>
                        </Stack>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!department.hod_id && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleAssignHOD(department)}
                              sx={{ 
                                color: '#e94560', 
                                borderColor: '#e94560',
                                '&:hover': { borderColor: '#e94560', backgroundColor: 'rgba(233, 69, 96, 0.1)' }
                              }}
                            >
                              Assign HOD
                            </Button>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleView(department)}
                            sx={{ color: '#3498db' }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(department)}
                            sx={{ color: '#f39c12' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(department)}
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
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Code</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>HOD</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.map((department) => (
                      <TableRow
                        key={department.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(233, 69, 96, 0.05)',
                          },
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {department.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Est. {department.established_year}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={department.department_code} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getHODName(department.hod_id)}
                          </Typography>
                          {!department.hod_id && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleAssignHOD(department)}
                              sx={{ 
                                mt: 1,
                                color: '#e94560', 
                                borderColor: '#e94560',
                                '&:hover': { borderColor: '#e94560', backgroundColor: 'rgba(233, 69, 96, 0.1)' }
                              }}
                            >
                              Assign HOD
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{department.email}</Typography>
                            {department.phone_number && (
                              <Typography variant="body2" color="text.secondary">
                                {department.phone_number}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleView(department)}
                              sx={{ color: '#3498db' }}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(department)}
                              sx={{ color: '#f39c12' }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(department)}
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

        {/* Create/Edit Department Dialog */}
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
            {editingDepartment ? 'Edit Department' : 'Create New Department'}
          </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Department Code"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleInputChange}
                  error={!!validationErrors.department_code}
                  helperText={validationErrors.department_code}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Department Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
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
                  label="Establishment Year"
                  name="established_year"
                  type="number"
                  value={formData.established_year}
                  onChange={handleInputChange}
                  error={!!validationErrors.established_year}
                  helperText={validationErrors.established_year}
                  inputProps={{ min: 1900, max: new Date().getFullYear() }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
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
              {editingDepartment ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Department Dialog */}
        <Dialog
          open={!!viewingDepartment}
          onClose={() => setViewingDepartment(null)}
          maxWidth="md"
          fullWidth
        >
          {viewingDepartment && (
            <>
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                color: 'white'
              }}>
                Department Details
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560', mb: 2 }}>
                      {viewingDepartment.name}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Department Code</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingDepartment.department_code}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip
                      label={viewingDepartment.status}
                      color={getStatusColor(viewingDepartment.status)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingDepartment.email}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingDepartment.phone_number || 'Not provided'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Established Year</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingDepartment.established_year || 'Not specified'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Head of Department</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {getHODName(viewingDepartment.hod_id)}
                    </Typography>
                  </Grid>
                  
                  {viewingDepartment.description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {viewingDepartment.description}
                      </Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Total Faculty</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingDepartment.total_faculty || 0}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Total Students</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingDepartment.total_students || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setViewingDepartment(null)} color="inherit">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewingDepartment(null);
                    handleEdit(viewingDepartment);
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

        {/* Assign HOD Dialog */}
        <Dialog
          open={openHODDialog}
          onClose={() => setOpenHODDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
            color: 'white'
          }}>
            Assign Head of Department
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedDepartment && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#e94560' }}>
                  {selectedDepartment.name}
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Select Faculty Member</InputLabel>
                  <Select
                    value={selectedHOD}
                    onChange={(e) => setSelectedHOD(e.target.value)}
                    label="Select Faculty Member"
                  >
                    {getDepartmentFaculty(selectedDepartment.id).map((facultyMember) => (
                      <MenuItem key={facultyMember.id} value={facultyMember.id}>
                        {facultyMember.first_name} {facultyMember.last_name} - {facultyMember.designation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {getDepartmentFaculty(selectedDepartment.id).length === 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    No active faculty members found in this department. Please add faculty members first.
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenHODDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleHODSubmit}
              variant="contained"
              disabled={!selectedHOD || getDepartmentFaculty(selectedDepartment?.id).length === 0}
              sx={{
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                },
              }}
            >
              Assign HOD
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default Departments;
