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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  TextareaAutosize,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const FacultyComplaints = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Mock data - replace with actual API calls
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      studentId: 'STU001',
      complaintType: 'Disruptive Behavior',
      description: 'Student was consistently talking during lectures and disrupting other students.',
      severity: 'Medium',
      reportedBy: 'Dr. Smith',
      date: '2024-01-15',
      previousIncidents: 2,
      actionTaken: 'Verbal warning issued',
      parentNotified: true,
      parentNotificationDate: '2024-01-16',
      disciplinaryAction: 'Warning',
      principalRemarks: 'Monitor behavior closely',
      status: 'Resolved',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      studentId: 'STU002',
      complaintType: 'Academic Dishonesty',
      description: 'Student was caught copying from another student during the midterm exam.',
      severity: 'High',
      reportedBy: 'Dr. Smith',
      date: '2024-01-20',
      previousIncidents: 0,
      actionTaken: 'Exam invalidated, zero grade',
      parentNotified: true,
      parentNotificationDate: '2024-01-21',
      disciplinaryAction: 'Suspension for 1 week',
      principalRemarks: 'Serious violation, strict monitoring required',
      status: 'Under Review',
    },
    {
      id: 3,
      studentName: 'Mike Johnson',
      studentId: 'STU003',
      complaintType: 'Attendance Issues',
      description: 'Student has missed 8 out of 15 classes without proper documentation.',
      severity: 'Low',
      reportedBy: 'Dr. Smith',
      date: '2024-01-25',
      previousIncidents: 1,
      actionTaken: 'Meeting scheduled with student',
      parentNotified: false,
      parentNotificationDate: null,
      disciplinaryAction: 'Attendance contract',
      principalRemarks: 'Monitor attendance improvement',
      status: 'Active',
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    complaintType: '',
    description: '',
    severity: '',
    reportedBy: 'Dr. Smith',
    date: new Date().toISOString().split('T')[0],
    previousIncidents: 0,
    actionTaken: '',
    parentNotified: false,
    parentNotificationDate: '',
    disciplinaryAction: '',
    principalRemarks: '',
    status: 'Active',
  });

  const complaintTypes = [
    'Disruptive Behavior',
    'Academic Dishonesty',
    'Attendance Issues',
    'Bullying/Harassment',
    'Property Damage',
    'Dress Code Violation',
    'Technology Misuse',
    'Other'
  ];

  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Active', 'Under Review', 'Resolved', 'Closed'];
  const disciplinaryActions = [
    'Verbal Warning',
    'Written Warning',
    'Detention',
    'Suspension',
    'Expulsion',
    'Community Service',
    'Parent Conference',
    'Other'
  ];

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ open: false, message: '', severity: 'info' }), 3000);
  };

  const handleOpenComplaintForm = (complaintData = null) => {
    if (complaintData) {
      setEditingComplaint(complaintData);
      setFormData(complaintData);
    } else {
      setEditingComplaint(null);
      setFormData({
        studentName: '',
        studentId: '',
        complaintType: '',
        description: '',
        severity: '',
        reportedBy: 'Dr. Smith',
        date: new Date().toISOString().split('T')[0],
        previousIncidents: 0,
        actionTaken: '',
        parentNotified: false,
        parentNotificationDate: '',
        disciplinaryAction: '',
        principalRemarks: '',
        status: 'Active',
      });
    }
    setShowComplaintForm(true);
  };

  const handleCloseComplaintForm = () => {
    setShowComplaintForm(false);
    setEditingComplaint(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.studentName || !formData.complaintType || !formData.description) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingComplaint) {
      // Update existing complaint
      setComplaints(prev => prev.map(comp => 
        comp.id === editingComplaint.id ? { ...formData, id: comp.id } : comp
      ));
      showNotification('Complaint updated successfully', 'success');
    } else {
      // Add new complaint
      const newComplaint = {
        ...formData,
        id: Date.now(),
      };
      setComplaints(prev => [...prev, newComplaint]);
      showNotification('Complaint submitted successfully', 'success');
    }
    handleCloseComplaintForm();
  };

  const handleDelete = (complaintId) => {
    setComplaints(prev => prev.filter(comp => comp.id !== complaintId));
    showNotification('Complaint deleted successfully', 'success');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'error';
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'warning';
      case 'Under Review': return 'info';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {!showComplaintForm ? (
        // Main Complaints Dashboard View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                Disciplinary Complaints
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenComplaintForm()}
              sx={{ minWidth: 120 }}
            >
              Submit Complaint
            </Button>
          </Box>

      {notification.open && (
        <Alert
          severity={notification.severity}
          sx={{ mb: 3 }}
          onClose={() => setNotification({ open: false, message: '', severity: 'info' })}
        >
          {notification.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {complaints.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Complaints
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {complaints.filter(c => c.status === 'Active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Cases
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {complaints.filter(c => c.severity === 'High' || c.severity === 'Critical').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High Priority
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {complaints.filter(c => c.status === 'Resolved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolved
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Complaints Table */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {complaint.studentName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {complaint.studentId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {complaint.complaintType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={complaint.severity} 
                      size="small" 
                      color={getSeverityColor(complaint.severity)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {complaint.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={complaint.status} 
                      size="small" 
                      color={getStatusColor(complaint.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenComplaintForm(complaint)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(complaint.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


        </>
      ) : (
        // Complaint Form View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                {editingComplaint ? 'Edit Complaint' : 'Submit New Complaint'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseComplaintForm}
              sx={{ minWidth: 120 }}
            >
              Back to Dashboard
            </Button>
          </Box>

          {notification.open && (
            <Alert
              severity={notification.severity}
              sx={{ mb: 3 }}
              onClose={() => setNotification({ open: false, message: '', severity: 'info' })}
            >
              {notification.message}
            </Alert>
          )}

          {/* Complaint Form */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student Name"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student ID"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Complaint Type</InputLabel>
                  <Select
                    value={formData.complaintType}
                    label="Complaint Type"
                    onChange={(e) => handleInputChange('complaintType', e.target.value)}
                    required
                  >
                    {complaintTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={formData.severity}
                    label="Severity"
                    onChange={(e) => handleInputChange('severity', e.target.value)}
                    required
                  >
                    {severityLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide detailed description of the incident..."
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Previous Incidents"
                  type="number"
                  value={formData.previousIncidents}
                  onChange={(e) => handleInputChange('previousIncidents', parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Action Taken"
                  value={formData.actionTaken}
                  onChange={(e) => handleInputChange('actionTaken', e.target.value)}
                  placeholder="What action was taken immediately?"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Disciplinary Action</InputLabel>
                  <Select
                    value={formData.disciplinaryAction}
                    label="Disciplinary Action"
                    onChange={(e) => handleInputChange('disciplinaryAction', e.target.value)}
                  >
                    {disciplinaryActions.map((action) => (
                      <MenuItem key={action} value={action}>{action}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.parentNotified}
                      onChange={(e) => handleInputChange('parentNotified', e.target.checked)}
                    />
                  }
                  label="Parent Notified"
                />
              </Grid>
              {formData.parentNotified && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Parent Notification Date"
                    type="date"
                    value={formData.parentNotificationDate}
                    onChange={(e) => handleInputChange('parentNotificationDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Principal Remarks"
                  multiline
                  rows={3}
                  value={formData.principalRemarks}
                  onChange={(e) => handleInputChange('principalRemarks', e.target.value)}
                  placeholder="Any additional remarks or recommendations..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseComplaintForm}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingComplaint ? 'Update' : 'Submit'} Complaint
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export { FacultyComplaints };
