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
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  time_slot_id: yup.number().required('Time slot is required'),
  student_id: yup.number().required('Student is required'),
  complaint_type: yup.string().oneOf([
    'late_arrival',
    'disturbance',
    'misbehavior',
    'unauthorized_device_usage',
    'inappropriate_conduct',
    'academic_dishonesty',
    'bullying',
    'other'
  ]).required('Complaint type is required'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  severity: yup.string().oneOf(['low', 'medium', 'high', 'critical']).required('Severity is required'),
  reported_by: yup.number().required('Reporter is required'),
  date: yup.date().required('Date is required'),
  previous_incidents: yup.number().min(0, 'Previous incidents cannot be negative'),
  action_taken: yup.string().when('status', {
    is: (status) => ['action_taken', 'resolved'].includes(status),
    then: yup.string().required('Action taken is required when status is action taken or resolved'),
    otherwise: yup.string().nullable()
  }),
  parent_notified: yup.boolean(),
  parent_notification_date: yup.date().when('parent_notified', {
    is: true,
    then: yup.date().required('Parent notification date is required when parent is notified'),
    otherwise: yup.date().nullable()
  }),
  disciplinary_action: yup.string().oneOf([
    'warning',
    'counseling',
    'parent_meeting',
    'detention',
    'suspension',
    'other'
  ]).nullable(),
  principal_remarks: yup.string().max(1000, 'Principal remarks cannot exceed 1000 characters'),
  status: yup.string().oneOf([
    'pending',
    'under_review',
    'escalated_to_principal',
    'action_taken',
    'resolved',
    'dismissed'
  ]).required('Status is required')
});

export const ComplaintForm = ({
  open,
  onClose,
  onSubmit,
  timeSlots = [],
  students = [],
  faculty = [],
  principals = [],
  initialValues = null,
  isLoading = false,
  isPrincipal = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      time_slot_id: '',
      student_id: '',
      complaint_type: '',
      description: '',
      severity: 'medium',
      reported_by: '',
      date: new Date().toISOString().split('T')[0],
      previous_incidents: 0,
      action_taken: '',
      parent_notified: false,
      parent_notification_date: '',
      disciplinary_action: '',
      principal_remarks: '',
      status: 'pending'
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleSeverityChange = (severity) => {
    formik.setFieldValue('severity', severity);
    // Auto-escalate critical complaints to principal
    if (severity === 'critical') {
      formik.setFieldValue('status', 'escalated_to_principal');
    }
  };

  const handleStatusChange = (status) => {
    formik.setFieldValue('status', status);
    // Clear action_taken if status is not action_taken or resolved
    if (!['action_taken', 'resolved'].includes(status)) {
      formik.setFieldValue('action_taken', '');
    }
  };

  const getComplaintTypeLabel = (type) => {
    const labels = {
      late_arrival: 'Late Arrival',
      disturbance: 'Disturbance',
      misbehavior: 'Misbehavior',
      unauthorized_device_usage: 'Unauthorized Device Usage',
      inappropriate_conduct: 'Inappropriate Conduct',
      academic_dishonesty: 'Academic Dishonesty',
      bullying: 'Bullying',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      case 'escalated_to_principal': return 'error';
      case 'action_taken': return 'primary';
      case 'resolved': return 'success';
      case 'dismissed': return 'default';
      default: return 'default';
    }
  };

  const getDisciplinaryActionLabel = (action) => {
    const labels = {
      warning: 'Warning',
      counseling: 'Counseling',
      parent_meeting: 'Parent Meeting',
      detention: 'Detention',
      suspension: 'Suspension',
      other: 'Other'
    };
    return labels[action] || action;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Complaint' : 'Submit New Complaint'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Basic Information */}
            <Typography variant="h6">Complaint Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Time Slot</InputLabel>
                  <Select
                    name="time_slot_id"
                    value={formik.values.time_slot_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.time_slot_id && Boolean(formik.errors.time_slot_id)}
                    label="Time Slot"
                  >
                    <MenuItem value="">
                      <em>Select Time Slot</em>
                    </MenuItem>
                    {timeSlots.map((ts) => (
                      <MenuItem key={ts.id} value={ts.id}>
                        {ts.day} - {ts.start_time} to {ts.end_time} - {ts.subject?.name || 'Unknown Subject'}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.time_slot_id && formik.errors.time_slot_id && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.time_slot_id}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Student</InputLabel>
                  <Select
                    name="student_id"
                    value={formik.values.student_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.student_id && Boolean(formik.errors.student_id)}
                    label="Student"
                  >
                    <MenuItem value="">
                      <em>Select Student</em>
                    </MenuItem>
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.student_id} - {student.first_name} {student.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.student_id && formik.errors.student_id && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formik.errors.student_id}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Complaint Type</InputLabel>
                  <Select
                    name="complaint_type"
                    value={formik.values.complaint_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.complaint_type && Boolean(formik.errors.complaint_type)}
                    label="Complaint Type"
                  >
                    <MenuItem value="">
                      <em>Select Complaint Type</em>
                    </MenuItem>
                    {Object.keys(validationSchema.fields.complaint_type.describe().oneOf).map((type) => (
                      <MenuItem key={type} value={type}>
                        {getComplaintTypeLabel(type)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    name="severity"
                    value={formik.values.severity}
                    onChange={(e) => handleSeverityChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.severity && Boolean(formik.errors.severity)}
                    label="Severity"
                  >
                    {['low', 'medium', 'high', 'critical'].map((level) => (
                      <MenuItem key={level} value={level}>
                        <Chip
                          label={level.charAt(0).toUpperCase() + level.slice(1)}
                          color={getSeverityColor(level)}
                          size="small"
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Reporter</InputLabel>
                  <Select
                    name="reported_by"
                    value={formik.values.reported_by}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.reported_by && Boolean(formik.errors.reported_by)}
                    label="Reporter"
                  >
                    <MenuItem value="">
                      <em>Select Reporter</em>
                    </MenuItem>
                    {faculty.map((fac) => (
                      <MenuItem key={fac.id} value={fac.id}>
                        {fac.first_name} {fac.last_name} - {fac.designation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="date"
                  label="Incident Date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="previous_incidents"
                  label="Previous Incidents"
                  type="number"
                  value={formik.values.previous_incidents}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.previous_incidents && Boolean(formik.errors.previous_incidents)}
                  helperText={formik.touched.previous_incidents && formik.errors.previous_incidents}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {/* Description */}
            <Typography variant="h6">Incident Description</Typography>
            <TextField
              fullWidth
              name="description"
              label="Detailed Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              placeholder="Provide a detailed description of the incident, including what happened, when, where, and any witnesses..."
            />

            {/* Status and Actions */}
            <Typography variant="h6">Status and Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    label="Status"
                  >
                    {['pending', 'under_review', 'escalated_to_principal', 'action_taken', 'resolved', 'dismissed'].map((status) => (
                      <MenuItem key={status} value={status}>
                        <Chip
                          label={status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          color={getStatusColor(status)}
                          size="small"
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Disciplinary Action</InputLabel>
                  <Select
                    name="disciplinary_action"
                    value={formik.values.disciplinary_action}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.disciplinary_action && Boolean(formik.errors.disciplinary_action)}
                    label="Disciplinary Action"
                  >
                    <MenuItem value="">
                      <em>Select Action</em>
                    </MenuItem>
                    {['warning', 'counseling', 'parent_meeting', 'detention', 'suspension', 'other'].map((action) => (
                      <MenuItem key={action} value={action}>
                        {getDisciplinaryActionLabel(action)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Taken */}
            {['action_taken', 'resolved'].includes(formik.values.status) && (
              <TextField
                fullWidth
                name="action_taken"
                label="Action Taken"
                multiline
                rows={3}
                value={formik.values.action_taken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.action_taken && Boolean(formik.errors.action_taken)}
                helperText={formik.touched.action_taken && formik.errors.action_taken}
                placeholder="Describe the action taken to address this complaint..."
              />
            )}

            {/* Parent Notification */}
            <Typography variant="h6">Parent Notification</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.parent_notified}
                      onChange={(e) => formik.setFieldValue('parent_notified', e.target.checked)}
                    />
                  }
                  label="Parent/Guardian Notified"
                />
              </Grid>
              {formik.values.parent_notified && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="parent_notification_date"
                    label="Notification Date"
                    type="date"
                    value={formik.values.parent_notification_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.parent_notification_date && Boolean(formik.errors.parent_notification_date)}
                    helperText={formik.touched.parent_notification_date && formik.errors.parent_notification_date}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
            </Grid>

            {/* Principal Remarks */}
            {isPrincipal && (
              <TextField
                fullWidth
                name="principal_remarks"
                label="Principal Remarks"
                multiline
                rows={3}
                value={formik.values.principal_remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.principal_remarks && Boolean(formik.errors.principal_remarks)}
                helperText={formik.touched.principal_remarks && formik.errors.principal_remarks}
                placeholder="Add any additional remarks or notes as Principal..."
              />
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
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : (isEditing ? 'Update' : 'Submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
