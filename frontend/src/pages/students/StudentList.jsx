import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


// Mock data - replace with actual API calls
const mockStudents = [
  {
    id: 1,
    student_id: 'STU001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@college.edu',
    department: { id: 1, name: 'Computer Science' },
    semester: 3,
    phone_number: '9876543210',
    date_of_birth: '2000-05-15',
    gender: 'male',
    status: 'active',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      pincode: '10001'
    },
    guardian_info: {
      name: 'Robert Doe',
      phone: '9876543211',
      relationship: 'Father',
      email: 'robert.doe@email.com'
    },
    academic_history: [
      { year: '2022-2023', semester: 1, cgpa: 8.5 },
      { year: '2022-2023', semester: 2, cgpa: 8.7 }
    ],
    achievements: [
      { title: 'Dean\'s List', year: 2023, description: 'Academic Excellence' }
    ]
  },
  {
    id: 2,
    student_id: 'STU002',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@college.edu',
    department: { id: 2, name: 'Electrical Engineering' },
    semester: 5,
    phone_number: '9876543212',
    date_of_birth: '1999-08-20',
    gender: 'female',
    status: 'active',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      pincode: '90210'
    },
    guardian_info: {
      name: 'Mary Smith',
      phone: '9876543213',
      relationship: 'Mother',
      email: 'mary.smith@email.com'
    },
    academic_history: [
      { year: '2021-2022', semester: 1, cgpa: 9.0 },
      { year: '2021-2022', semester: 2, cgpa: 9.2 },
      { year: '2022-2023', semester: 1, cgpa: 9.1 },
      { year: '2022-2023', semester: 2, cgpa: 9.3 }
    ],
    achievements: [
      { title: 'Best Student Award', year: 2022, description: 'Outstanding Performance' },
      { title: 'Dean\'s List', year: 2023, description: 'Academic Excellence' }
    ]
  },
  {
    id: 3,
    student_id: 'STU003',
    first_name: 'Michael',
    last_name: 'Johnson',
    email: 'michael.johnson@college.edu',
    department: { id: 1, name: 'Computer Science' },
    semester: 7,
    phone_number: '9876543214',
    date_of_birth: '1998-12-10',
    gender: 'male',
    status: 'active',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      pincode: '60601'
    },
    guardian_info: {
      name: 'David Johnson',
      phone: '9876543215',
      relationship: 'Father',
      email: 'david.johnson@email.com'
    },
    academic_history: [
      { year: '2020-2021', semester: 1, cgpa: 7.8 },
      { year: '2020-2021', semester: 2, cgpa: 8.1 },
      { year: '2021-2022', semester: 1, cgpa: 8.3 },
      { year: '2021-2022', semester: 2, cgpa: 8.5 },
      { year: '2022-2023', semester: 1, cgpa: 8.7 },
      { year: '2022-2023', semester: 2, cgpa: 8.9 }
    ],
    achievements: [
      { title: 'Project Excellence', year: 2022, description: 'Best Final Year Project' }
    ]
  }
];

const mockDepartments = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Electrical Engineering' },
  { id: 3, name: 'Mechanical Engineering' },
  { id: 4, name: 'Civil Engineering' }
];

export const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    filterStudents();
  }, [searchTerm, departmentFilter, statusFilter, semesterFilter, students]);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ open: false, message: '', severity: 'info' }), 3000);
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(student => student.department.id === parseInt(departmentFilter));
    }

    if (statusFilter) {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    if (semesterFilter) {
      filtered = filtered.filter(student => student.semester === parseInt(semesterFilter));
    }

    setFilteredStudents(filtered);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentFilter = (event) => {
    setDepartmentFilter(event.target.value);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSemesterFilter = (event) => {
    setSemesterFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddStudent = () => {
    navigate('/principal/students/add');
  };

  const handleEditStudent = (student) => {
    // For now, just show an alert. You can implement edit functionality later
    alert('Edit functionality will be implemented in a separate page');
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    // Navigate to student details page or open modal
    showNotification(`Viewing ${student.first_name} ${student.last_name}`, 'info');
  };

  const handleDeleteStudent = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`)) {
      setStudents(students.filter(s => s.id !== student.id));
      showNotification('Student deleted successfully', 'success');
    }
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'alumni': return 'info';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getGenderIcon = (gender) => {
    return gender === 'male' ? '👨' : gender === 'female' ? '👩' : '👤';
  };

  const getCurrentCGPA = (academicHistory) => {
    if (!academicHistory || academicHistory.length === 0) return 'N/A';
    const latest = academicHistory[academicHistory.length - 1];
    return latest.cgpa.toFixed(2);
  };

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Student Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudent}
        >
          Add Student
        </Button>
      </Box>

      {/* Notification */}
      {notification.open && (
        <Alert 
          severity={notification.severity} 
          sx={{ mb: 2 }}
          onClose={() => setNotification({ open: false, message: '', severity: 'info' })}
        >
          {notification.message}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                onChange={handleDepartmentFilter}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                {mockDepartments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilter}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="alumni">Alumni</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={semesterFilter}
                onChange={handleSemesterFilter}
                label="Semester"
              >
                <MenuItem value="">All Semesters</MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                startIcon={<FilterIcon />}
              >
                Table View
              </Button>
              <Button
                variant={viewMode === 'card' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('card')}
                startIcon={<PersonIcon />}
              >
                Card View
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredStudents.length} of {students.length} students
        </Typography>
      </Box>

      {/* Table View */}
      {viewMode === 'table' && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>CGPA</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {student.student_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {getGenderIcon(student.gender)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {student.first_name} {student.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.department.name}
                        size="small"
                        variant="outlined"
                        icon={<SchoolIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Sem ${student.semester}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.phone_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        size="small"
                        color={getStatusColor(student.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {getCurrentCGPA(student.academic_history)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewStudent(student)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Student">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditStudent(student)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Student">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteStudent(student)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <Grid container spacing={3}>
          {paginatedStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <Card hover>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56 }}>
                      {getGenderIcon(student.gender)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {student.first_name} {student.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.student_id}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={student.department.name}
                      size="small"
                      variant="outlined"
                      icon={<SchoolIcon />}
                      sx={{ mb: 1, mr: 1 }}
                    />
                    <Chip
                      label={`Sem ${student.semester}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1, mr: 1 }}
                    />
                    <Chip
                      label={student.status}
                      size="small"
                      color={getStatusColor(student.status)}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {student.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Phone:</strong> {student.phone_number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>CGPA:</strong> {getCurrentCGPA(student.academic_history)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewStudent(student)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Student">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditStudent(student)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Student">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteStudent(student)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}


    </Box>
  );
};
