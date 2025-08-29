import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AttendanceForm } from '../../components/forms/AttendanceForm';
import { ComplaintForm } from '../../components/forms/ComplaintForm';
import { SectionStudentForm } from '../../components/forms/SectionStudentForm';

const StudentForms = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openForm, setOpenForm] = useState(null);

  const forms = [
    {
      id: 'attendance',
      title: 'Attendance Management',
      description: 'Mark and manage student attendance records',
      icon: <ScheduleIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
      form: AttendanceForm,
    },
    {
      id: 'complaint',
      title: 'Disciplinary Complaints',
      description: 'Submit and manage disciplinary complaints',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      color: theme.palette.error.main,
      form: ComplaintForm,
    },
    {
      id: 'section',
      title: 'Section Enrollment',
      description: 'Manage student enrollment in course sections',
      icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
      form: SectionStudentForm,
    },
  ];

  const handleOpenForm = (formId) => {
    setOpenForm(formId);
  };

  const handleCloseForm = () => {
    setOpenForm(null);
  };

  const getFormComponent = (formId) => {
    const form = forms.find(f => f.id === formId);
    if (!form) return null;
    
    const FormComponent = form.form;
    return <FormComponent onClose={handleCloseForm} />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Student Forms
      </Typography>
      
      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={form.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => handleOpenForm(form.id)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {form.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {form.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, minHeight: '3rem' }}
                >
                  {form.description}
                </Typography>
                <Chip 
                  label="Click to Open" 
                  size="small" 
                  sx={{ 
                    backgroundColor: form.color,
                    color: 'white',
                    fontWeight: 500,
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Form Dialogs */}
      {openForm && (
        <Dialog
          open={!!openForm}
          onClose={handleCloseForm}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {forms.find(f => f.id === openForm)?.title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseForm}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {getFormComponent(openForm)}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export { StudentForms };
