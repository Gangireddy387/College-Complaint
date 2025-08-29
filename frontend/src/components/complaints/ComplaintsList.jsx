import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as ResolveIcon,
} from '@mui/icons-material';
import { DataTable } from '../shared/DataTable';
import { ComplaintForm } from './ComplaintForm';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'resolved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

export const ComplaintsList = ({
  complaints,
  isLoading,
  error,
  onEdit,
  onView,
  onResolve,
  userRole,
  showActions = true,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolveData, setResolveData] = useState({
    actionTaken: '',
    remarks: '',
  });

  const handleEdit = (complaint) => {
    setSelectedComplaint(complaint);
    setIsFormOpen(true);
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    // You can implement a view dialog here
  };

  const handleResolve = (complaint) => {
    setSelectedComplaint(complaint);
    setIsResolveDialogOpen(true);
  };

  const handleResolveSubmit = () => {
    if (onResolve && selectedComplaint) {
      onResolve(selectedComplaint.id, resolveData);
      setIsResolveDialogOpen(false);
      setResolveData({ actionTaken: '', remarks: '' });
    }
  };

  const columns = [
    {
      id: 'complaintType',
      label: 'Type',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      format: (value) => (
        <Typography variant="body2" noWrap>
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </Typography>
      ),
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value.toUpperCase()}
          size="small"
          color={getPriorityColor(value)}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value) => (
        <Chip
          label={value.replace('_', ' ').toUpperCase()}
          size="small"
          color={getStatusColor(value)}
        />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (showActions) {
    columns.push({
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      format: (value, row) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleView(row)}
            title="View Details"
          >
            <ViewIcon />
          </IconButton>
          {userRole === 'student' && row.status === 'pending' && (
            <IconButton
              size="small"
              onClick={() => handleEdit(row)}
              title="Edit Complaint"
            >
              <EditIcon />
            </IconButton>
          )}
          {(userRole === 'faculty' || userRole === 'principal') && row.status !== 'resolved' && (
            <IconButton
              size="small"
              onClick={() => handleResolve(row)}
              title="Resolve Complaint"
              color="success"
            >
              <ResolveIcon />
            </IconButton>
          )}
        </Box>
      ),
    });
  }

  return (
    <Box>
      <DataTable
        columns={columns}
        data={complaints}
        totalCount={complaints?.length || 0}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        isLoading={isLoading}
        error={error}
      />

      {/* Edit/Add Complaint Form */}
      <ComplaintForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedComplaint(null);
        }}
        onSubmit={(values) => {
          if (onEdit && selectedComplaint) {
            onEdit(selectedComplaint.id, values);
          }
          setIsFormOpen(false);
          setSelectedComplaint(null);
        }}
        initialValues={selectedComplaint}
      />

      {/* Resolve Complaint Dialog */}
      <Dialog open={isResolveDialogOpen} onClose={() => setIsResolveDialogOpen(false)}>
        <DialogTitle>Resolve Complaint</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Action Taken"
              value={resolveData.actionTaken}
              onChange={(e) => setResolveData({ ...resolveData, actionTaken: e.target.value })}
              placeholder="Describe the action taken to resolve this complaint..."
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Remarks"
              value={resolveData.remarks}
              onChange={(e) => setResolveData({ ...resolveData, remarks: e.target.value })}
              placeholder="Additional remarks or notes..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsResolveDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleResolveSubmit}
            variant="contained"
            color="success"
            disabled={!resolveData.actionTaken.trim()}
          >
            Resolve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
