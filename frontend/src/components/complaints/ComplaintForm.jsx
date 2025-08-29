import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  complaintType: yup.string().required('Complaint type is required'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  priority: yup.string().required('Priority is required'),
});

export const ComplaintForm = ({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  isLoading = false,
}) => {
  const isEditing = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      complaintType: '',
      description: '',
      priority: 'medium',
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Complaint' : 'Submit New Complaint'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Complaint Type</InputLabel>
              <Select
                name="complaintType"
                value={formik.values.complaintType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.complaintType && Boolean(formik.errors.complaintType)}
              >
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="disciplinary">Disciplinary</MenuItem>
                <MenuItem value="facility">Facility</MenuItem>
                <MenuItem value="harassment">Harassment</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {formik.touched.complaintType && formik.errors.complaintType && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {formik.errors.complaintType}
                </Alert>
              )}
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              placeholder="Please provide a detailed description of your complaint..."
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.priority && Boolean(formik.errors.priority)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
              {formik.touched.priority && formik.errors.priority && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {formik.errors.priority}
                </Alert>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !formik.isValid}
          >
            {isLoading ? (
              <CircularProgress size={20} />
            ) : isEditing ? (
              'Update'
            ) : (
              'Submit'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
