import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  section_id: yup.number().required('Section is required'),
  students: yup.array().of(yup.object({
    student_id: yup.number().required('Student is required'),
    enrollment_date: yup.date().required('Enrollment date is required'),
    status: yup.string().oneOf(['active', 'inactive', 'transferred', 'graduated']).required('Status is required'),
    remarks: yup.string().max(500, 'Remarks cannot exceed 500 characters')
  })).min(1, 'At least one student must be enrolled')
});

export const SectionStudentForm = ({
  open,
  onClose,
  onSubmit,
  sections = [],
  students = [],
  initialValues = null,
  isLoading = false,
}) => {
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      section_id: '',
      students: []
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setAvailableStudents([]);
    setSelectedSection(null);
    onClose();
  };

  const handleSectionChange = (sectionId) => {
    formik.setFieldValue('section_id', sectionId);
    const section = sections.find(s => s.id === sectionId);
    setSelectedSection(section);
    
    if (section) {
      // Filter students who are not already enrolled in this section
      const enrolledStudentIds = formik.values.students.map(s => s.student_id);
      const availableStudents = students.filter(student => 
        !enrolledStudentIds.includes(student.id) && 
        student.department_id === section.department_id
      );
      setAvailableStudents(availableStudents);
    }
  };

  const addStudent = () => {
    if (availableStudents.length > 0) {
      const newStudent = {
        student_id: availableStudents[0].id,
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'active',
        remarks: ''
      };
      
      const updatedStudents = [...formik.values.students, newStudent];
      formik.setFieldValue('students', updatedStudents);
      
      // Update available students
      const remainingStudents = availableStudents.filter(s => s.id !== newStudent.student_id);
      setAvailableStudents(remainingStudents);
    }
  };

  const removeStudent = (index) => {
    const removedStudent = formik.values.students[index];
    const updatedStudents = formik.values.students.filter((_, i) => i !== index);
    formik.setFieldValue('students', updatedStudents);
    
    // Add back to available students if not in initial values
    if (!isEditing || !initialValues?.students?.find(s => s.student_id === removedStudent.student_id)) {
      const student = students.find(s => s.id === removedStudent.student_id);
      if (student) {
        setAvailableStudents(prev => [...prev, student]);
      }
    }
  };

  const updateStudent = (index, field, value) => {
    const updatedStudents = [...formik.values.students];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    formik.setFieldValue('students', updatedStudents);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown Student';
  };

  const getStudentRollNumber = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.student_id : 'N/A';
  };

  const getStudentDepartment = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.department?.name || 'N/A';
  };

  const getSectionName = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? `${section.name} (${section.department?.name})` : 'Unknown Section';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Section Enrollment' : 'Manage Section Enrollment'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Section Selection */}
            <Typography variant="h6">Section Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Section</InputLabel>
                  <Select
                    name="section_id"
                    value={formik.values.section_id}
                    onChange={(e) => handleSectionChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.section_id && Boolean(formik.errors.section_id)}
                    label="Section"
                  >
                    <MenuItem value="">
                      <em>Select Section</em>
                    </MenuItem>
                    {sections.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.name} - {section.department?.name} - {section.class_teacher?.first_name} {section.class_teacher?.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.section_id && formik.errors.section_id && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.section_id}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Section Details */}
            {selectedSection && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>Section Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Section Name:</strong> {selectedSection.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Department:</strong> {selectedSection.department?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Class Teacher:</strong> {selectedSection.class_teacher?.first_name} {selectedSection.class_teacher?.last_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Classroom:</strong> {selectedSection.class_room?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Capacity:</strong> {selectedSection.capacity || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Current Enrollment:</strong> {formik.values.students.length}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Student Management */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Enrolled Students</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addStudent}
                disabled={availableStudents.length === 0}
              >
                Add Student
              </Button>
            </Box>

            {formik.values.students.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Roll Number</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Enrollment Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formik.values.students.map((enrollment, index) => (
                      <TableRow key={enrollment.student_id}>
                        <TableCell>
                          {getStudentRollNumber(enrollment.student_id)}
                        </TableCell>
                        <TableCell>
                          {getStudentName(enrollment.student_id)}
                        </TableCell>
                        <TableCell>
                          {getStudentDepartment(enrollment.student_id)}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="date"
                            value={enrollment.enrollment_date}
                            onChange={(e) => updateStudent(index, 'enrollment_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 150 }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small">
                            <Select
                              value={enrollment.status}
                              onChange={(e) => updateStudent(index, 'status', e.target.value)}
                              sx={{ minWidth: 120 }}
                            >
                              {['active', 'inactive', 'transferred', 'graduated'].map((status) => (
                                <MenuItem key={status} value={status}>
                                  <Chip
                                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                                    color={status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'default'}
                                    size="small"
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={enrollment.remarks || ''}
                            onChange={(e) => updateStudent(index, 'remarks', e.target.value)}
                            placeholder="Optional remarks"
                            sx={{ width: 150 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Remove Student">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeStudent(index)}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  No students enrolled yet. Click "Add Student" to enroll students in this section.
                </Typography>
              </Box>
            )}

            {/* Available Students */}
            {availableStudents.length > 0 && (
              <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>Available Students</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {availableStudents.length} students available for enrollment in this section.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableStudents.slice(0, 10).map((student) => (
                    <Chip
                      key={student.id}
                      label={`${student.student_id} - ${student.first_name} ${student.last_name}`}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                  {availableStudents.length > 10 && (
                    <Chip
                      label={`+${availableStudents.length - 10} more`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Validation Errors */}
            {formik.touched.students && formik.errors.students && (
              <Alert severity="error">
                {formik.errors.students}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || formik.values.students.length === 0}
          >
            {isLoading ? <CircularProgress size={20} /> : (isEditing ? 'Update' : 'Save Enrollment')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
