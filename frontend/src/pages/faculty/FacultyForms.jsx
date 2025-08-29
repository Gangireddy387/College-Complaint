import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { AttendanceForm } from '../../components/forms/AttendanceForm';
import { ComplaintForm } from '../../components/forms/ComplaintForm';
import { SectionStudentForm } from '../../components/forms/SectionStudentForm';
import { FacultyClasses } from './FacultyClasses';
import { FacultyComplaints } from './FacultyComplaints';
import { FacultyTimetable } from './FacultyTimetable';
import { FacultyAttendance } from './FacultyAttendance';

const FacultyForms = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedView, setSelectedView] = useState(null);

  const forms = [
    {
      id: 'classes',
      title: 'Class Management',
      description: 'Manage your classes, students, and course details',
      icon: <SchoolIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
      component: FacultyClasses,
    },
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: 'Mark and manage student attendance records',
      icon: <ScheduleIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
      component: FacultyAttendance,
    },
    {
      id: 'complaints',
      title: 'Disciplinary Complaints',
      description: 'Submit and manage disciplinary complaints',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      color: theme.palette.error.main,
      component: FacultyComplaints,
    },
    {
      id: 'timetable',
      title: 'Timetable Management',
      description: 'Manage your class schedule and time slots',
      icon: <BookIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
      component: FacultyTimetable,
    },
    {
      id: 'section',
      title: 'Section Management',
      description: 'Manage student enrollment in course sections',
      icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
      form: SectionStudentForm,
    },
  ];

  const handleSelectView = (viewId) => {
    setSelectedView(viewId);
  };

  const handleBackToMenu = () => {
    setSelectedView(null);
  };

  const getViewComponent = (viewId) => {
    const view = forms.find(f => f.id === viewId);
    if (!view) return null;
    
    if (view.component) {
      const Component = view.component;
      return <Component />;
    } else if (view.form) {
      const FormComponent = view.form;
      return <FormComponent onClose={handleBackToMenu} />;
    }
    
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      {!selectedView ? (
        // Main Menu View
        <>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Faculty Management
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
                  onClick={() => handleSelectView(form.id)}
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
        </>
      ) : (
        // Selected View
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {forms.find(f => f.id === selectedView)?.title}
            </Typography>
            <IconButton
              aria-label="back to menu"
              onClick={handleBackToMenu}
              sx={{
                color: (theme) => theme.palette.grey[500],
                backgroundColor: (theme) => theme.palette.grey[100],
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.grey[200],
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {getViewComponent(selectedView)}
        </>
      )}
    </Box>
  );
};

export { FacultyForms };
