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
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Group,
  Add,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  CalendarToday,
  School,
  Badge,
  ExpandMore,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { principalService } from '../../services/principal.service';
import MainLayout from '../../layouts/MainLayout';

const Students = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [viewingAttendance, setViewingAttendance] = useState(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department_id: '',
    section_id: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    admission_date: '',
    status: 'active'
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsResponse, departmentsResponse, sectionsResponse] = await Promise.all([
        principalService.getStudents(),
        principalService.getAvailableDepartments(),
        principalService.getAvailableSections()
      ]);
      
      setStudents(studentsResponse.data);
      setDepartments(departmentsResponse.data);
      setSections(sectionsResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load students');
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
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.student_id) errors.student_id = 'Student ID is required';
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!editingStudent && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.department_id) errors.department_id = 'Department is required';
    if (!formData.section_id) errors.section_id = 'Section is required';
    if (!formData.admission_date) errors.admission_date = 'Admission date is required';
    
    if (formData.phone_number && !/^[0-9]{10}$/.test(formData.phone_number)) {
      errors.phone_number = 'Phone number must be 10 digits';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = { ...formData };
      if (editingStudent && !submitData.password) {
        delete submitData.password;
      }

      if (editingStudent) {
        await principalService.updateStudent(editingStudent.id, submitData);
        setSuccess('Student updated successfully!');
      } else {
        await principalService.createStudent(submitData);
        setSuccess('Student created successfully!');
      }
      
      setOpenDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      password: '',
      department_id: student.department_id,
      section_id: student.section_id,
      phone_number: student.phone_number || '',
      date_of_birth: student.date_of_birth || '',
      gender: student.gender || '',
      address: student.address || '',
      parent_name: student.parent_name || '',
      parent_phone: student.parent_phone || '',
      parent_email: student.parent_email || '',
      admission_date: student.admission_date,
      status: student.status
    });
    setOpenDialog(true);
  };

  const handleView = (student) => {
    setViewingStudent(student);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`)) {
      try {
        await principalService.deleteStudent(student.id);
        setSuccess('Student deleted successfully!');
        loadData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      department_id: '',
      section_id: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      address: '',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      admission_date: '',
      status: 'active'
    });
    setValidationErrors({});
    setEditingStudent(null);
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Not assigned';
  };

  const getSectionName = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.name : 'Not assigned';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const getFullName = (student) => {
    return `${student.first_name} ${student.last_name}`;
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
            Student Management
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Manage student records and academic information
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
          <Grid item xs={12} sm={4}>
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
                      {students.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Students
                    </Typography>
                  </Box>
                  <Group sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
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
                      {students.filter(s => s.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Students
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card
              elevation={3}
              sx={{
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(231, 76, 60, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {students.filter(s => s.status === 'suspended').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Suspended Students
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: '#e94560',
                    },
                  },
                }}
              >
                <Tab label="All Students" />
                <Tab label="Attendance Records" />
                <Tab label="Complaints & Disciplinary" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560' }}>
                    Student List
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                      resetForm();
                      setOpenDialog(true);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f39c12 0%, #e94560 100%)',
                      },
                    }}
                  >
                    Add Student
                  </Button>
                </Box>

                {isMobile ? (
                  // Mobile view - Cards
                  <Grid container spacing={2}>
                    {students.map((student) => (
                      <Grid item xs={12} key={student.id}>
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
                                  {getFullName(student)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  ID: {student.student_id}
                                </Typography>
                              </Box>
                              <Chip
                                label={student.status}
                                color={getStatusColor(student.status)}
                                size="small"
                              />
                            </Box>
                            
                            <Stack spacing={1} sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                                <Typography variant="body2">{student.email}</Typography>
                              </Box>
                              {student.phone_number && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Phone sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                                  <Typography variant="body2">{student.phone_number}</Typography>
                                </Box>
                              )}
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <School sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                                <Typography variant="body2">{getDepartmentName(student.department_id)}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Badge sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                                <Typography variant="body2">{getSectionName(student.section_id)}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarToday sx={{ fontSize: 16, mr: 1, color: '#e94560' }} />
                                <Typography variant="body2">Admitted: {new Date(student.admission_date).toLocaleDateString()}</Typography>
                              </Box>
                            </Stack>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleView(student)}
                                sx={{ color: '#3498db' }}
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(student)}
                                sx={{ color: '#f39c12' }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(student)}
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
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student ID</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Section</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow
                            key={student.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(233, 69, 96, 0.05)',
                              },
                            }}
                          >
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {getFullName(student)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {student.email}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={student.student_id} size="small" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {getDepartmentName(student.department_id)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {getSectionName(student.section_id)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">{student.email}</Typography>
                                {student.phone_number && (
                                  <Typography variant="body2" color="text.secondary">
                                    {student.phone_number}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={student.status}
                                color={getStatusColor(student.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleView(student)}
                                  sx={{ color: '#3498db' }}
                                >
                                  <Visibility />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(student)}
                                  sx={{ color: '#f39c12' }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(student)}
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
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560', mb: 3 }}>
                  Attendance Records
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                  Select a student to view their attendance records.
                </Typography>
                
                <Grid container spacing={2}>
                  {students.slice(0, 6).map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                      <Card
                        elevation={2}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(233, 69, 96, 0.2)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => setViewingAttendance(student)}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e94560' }}>
                            {getFullName(student)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.student_id}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {getDepartmentName(student.department_id)} - {getSectionName(student.section_id)}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Chip 
                              label="View Attendance" 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                                color: 'white'
                              }} 
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560', mb: 3 }}>
                  Complaints & Disciplinary Actions
                </Typography>
                
                <Accordion sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Warning sx={{ color: '#e74c3c', mr: 1 }} />
                      <Typography variant="h6">Pending Complaints (3)</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {[1, 2, 3].map((item) => (
                        <Grid item xs={12} key={item}>
                          <Card sx={{ border: '1px solid #e74c3c' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Complaint #{item}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Reported on: {new Date().toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="body1" sx={{ mt: 1 }}>
                                    Student misconduct in classroom
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button size="small" variant="contained" color="error">
                                    Suspend
                                  </Button>
                                  <Button size="small" variant="outlined">
                                    Review
                                  </Button>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#27ae60', mr: 1 }} />
                      <Typography variant="h6">Resolved Cases (5)</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Grid item xs={12} key={item}>
                          <Card sx={{ border: '1px solid #27ae60' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Case #{item}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Resolved on: {new Date().toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="body1" sx={{ mt: 1 }}>
                                    Warning issued - No further action required
                                  </Typography>
                                </Box>
                                <Chip label="Resolved" color="success" size="small" />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Floating Action Button for Mobile */}
        {isMobile && activeTab === 0 && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              resetForm();
              setOpenDialog(true);
            }}
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

        {/* Create/Edit Student Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
            color: 'white'
          }}>
            {editingStudent ? 'Edit Student' : 'Create New Student'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student ID"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  error={!!validationErrors.student_id}
                  helperText={validationErrors.student_id}
                  required
                  sx={{ mt: 2 }}
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
                  sx={{ mt: 2 }}
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
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password || (editingStudent ? 'Leave blank to keep current password' : '')}
                  required={!editingStudent}
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
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admission Date"
                  name="admission_date"
                  type="date"
                  value={formData.admission_date}
                  onChange={handleInputChange}
                  error={!!validationErrors.admission_date}
                  helperText={validationErrors.admission_date}
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
                  <InputLabel>Section</InputLabel>
                  <Select
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleInputChange}
                    label="Section"
                    error={!!validationErrors.section_id}
                  >
                    <MenuItem value="">
                      <em>Select Section</em>
                    </MenuItem>
                    {sections.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.name}
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
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent Name"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent Phone"
                  name="parent_phone"
                  value={formData.parent_phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Parent Email"
                  name="parent_email"
                  type="email"
                  value={formData.parent_email}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
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
              {editingStudent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Student Dialog */}
        <Dialog
          open={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          maxWidth="md"
          fullWidth
        >
          {viewingStudent && (
            <>
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                color: 'white'
              }}>
                Student Details
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e94560', mb: 2 }}>
                      {getFullName(viewingStudent)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Student ID</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingStudent.student_id}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip
                      label={viewingStudent.status}
                      color={getStatusColor(viewingStudent.status)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingStudent.email}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingStudent.phone_number || 'Not provided'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {getDepartmentName(viewingStudent.department_id)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Section</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {getSectionName(viewingStudent.section_id)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Admission Date</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(viewingStudent.admission_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {viewingStudent.date_of_birth ? new Date(viewingStudent.date_of_birth).toLocaleDateString() : 'Not provided'}
                    </Typography>
                  </Grid>
                  
                  {viewingStudent.address && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {viewingStudent.address}
                      </Typography>
                    </Grid>
                  )}
                  
                  {viewingStudent.parent_name && (
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e94560', mb: 2 }}>
                        Parent Information
                      </Typography>
                    </Grid>
                  )}
                  
                  {viewingStudent.parent_name && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Parent Name</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {viewingStudent.parent_name}
                      </Typography>
                    </Grid>
                  )}
                  
                  {viewingStudent.parent_phone && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Parent Phone</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {viewingStudent.parent_phone}
                      </Typography>
                    </Grid>
                  )}
                  
                  {viewingStudent.parent_email && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Parent Email</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {viewingStudent.parent_email}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setViewingStudent(null)} color="inherit">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewingStudent(null);
                    handleEdit(viewingStudent);
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

        {/* View Attendance Dialog */}
        <Dialog
          open={!!viewingAttendance}
          onClose={() => setViewingAttendance(null)}
          maxWidth="md"
          fullWidth
        >
          {viewingAttendance && (
            <>
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                color: 'white'
              }}>
                Attendance Records - {getFullName(viewingAttendance)}
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Attendance (Last 30 Days)
                </Typography>
                
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.from({ length: 10 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        const isPresent = Math.random() > 0.2;
                        return (
                          <TableRow key={i}>
                            <TableCell>{date.toLocaleDateString()}</TableCell>
                            <TableCell>Subject {i + 1}</TableCell>
                            <TableCell>
                              <Chip
                                label={isPresent ? 'Present' : 'Absent'}
                                color={isPresent ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {!isPresent && 'No reason provided'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Attendance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                          85%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Overall Attendance
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                          3
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Absences This Month
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: '#f39c12', fontWeight: 'bold' }}>
                          17
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Present Days
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setViewingAttendance(null)} color="inherit">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default Students;
