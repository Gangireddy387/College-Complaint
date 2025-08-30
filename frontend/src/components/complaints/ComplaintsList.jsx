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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as ResolveIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ResponsiveTable } from '../shared/ResponsiveTable';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
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

  const handleRowClick = (complaint) => {
    console.log('Complaint clicked:', complaint);
    // Show detailed complaint information
  };

  // Convert complaints data for ResponsiveTable
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'title',
      headerName: 'Title',
      bold: true,
      hideOnMobile: false,
      hideOnTablet: false,
    },
    {
      field: 'type',
      headerName: 'Type',
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
          color={getPriorityColor(value)}
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
          color={getStatusColor(value)}
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
      field: 'description',
      headerName: 'Description',
      hideOnMobile: true,
      hideOnTablet: false,
    },
  ];

  const expandableComplaintContent = (complaint) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Complaint Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Title:</strong> {complaint.title}
        </Typography>
        <Typography variant="body2">
          <strong>Type:</strong> {complaint.type}
        </Typography>
        <Typography variant="body2">
          <strong>Priority:</strong> {complaint.priority}
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong> {complaint.status}
        </Typography>
        <Typography variant="body2">
          <strong>Date:</strong> {complaint.date}
        </Typography>
      </Box>
      <Typography variant="body2">
        <strong>Description:</strong> {complaint.description}
      </Typography>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Current View Mode Indicator */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mb: 2 }}
      >
        <Typography variant="body2">
          <strong>Current View:</strong> {
            isMobile ? 'Mobile Grid View (Single Column Cards)' :
            isTablet && !isMobile ? 'Tablet Grid View (2-Column Cards)' :
            'Desktop Table View (Full Table)'
          }
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Resize your browser window to see the complaints data transform into different layouts!
        </Typography>
      </Alert>

      <ResponsiveTable
        columns={columns}
        data={complaints || []}
        onRowClick={handleRowClick}
        onEdit={showActions ? handleEdit : undefined}
        onDelete={undefined} // No delete action for complaints
        expandable={true}
        expandableContent={expandableComplaintContent}
        emptyMessage="No complaints found"
        customActions={(row) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => handleView(row)}
              title="View Complaint"
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
        )}
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
