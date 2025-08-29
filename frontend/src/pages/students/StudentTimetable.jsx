import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const StudentTimetable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDay, setSelectedDay] = useState(0);

  // Mock timetable data - replace with actual API calls
  const weeklySchedule = [
    {
      day: 'Monday',
      classes: [
        {
          time: '09:00 - 10:00',
          subject: 'Computer Science',
          teacher: 'Dr. Smith',
          room: 'Lab 101',
          type: 'Lecture',
        },
        {
          time: '10:15 - 11:15',
          subject: 'Mathematics',
          teacher: 'Prof. Johnson',
          room: 'Room 205',
          type: 'Tutorial',
        },
        {
          time: '14:00 - 16:00',
          subject: 'Computer Science',
          teacher: 'Dr. Smith',
          room: 'Lab 101',
          type: 'Practical',
        },
      ],
    },
    {
      day: 'Tuesday',
      classes: [
        {
          time: '09:00 - 10:00',
          subject: 'English',
          teacher: 'Ms. Davis',
          room: 'Room 103',
          type: 'Lecture',
        },
        {
          time: '11:00 - 12:00',
          subject: 'Physics',
          teacher: 'Dr. Wilson',
          room: 'Lab 202',
          type: 'Practical',
        },
      ],
    },
    {
      day: 'Wednesday',
      classes: [
        {
          time: '09:00 - 10:00',
          subject: 'Computer Science',
          teacher: 'Dr. Smith',
          room: 'Lab 101',
          type: 'Lecture',
        },
        {
          time: '14:00 - 15:00',
          subject: 'Mathematics',
          teacher: 'Prof. Johnson',
          room: 'Room 205',
          type: 'Lecture',
        },
      ],
    },
    {
      day: 'Thursday',
      classes: [
        {
          time: '10:00 - 11:00',
          subject: 'Physics',
          teacher: 'Dr. Wilson',
          room: 'Room 201',
          type: 'Lecture',
        },
        {
          time: '14:00 - 16:00',
          subject: 'English',
          teacher: 'Ms. Davis',
          room: 'Room 103',
          type: 'Discussion',
        },
      ],
    },
    {
      day: 'Friday',
      classes: [
        {
          time: '09:00 - 10:00',
          subject: 'Computer Science',
          teacher: 'Dr. Smith',
          room: 'Lab 101',
          type: 'Lecture',
        },
        {
          time: '11:00 - 12:00',
          subject: 'Mathematics',
          teacher: 'Prof. Johnson',
          room: 'Room 205',
          type: 'Tutorial',
        },
      ],
    },
  ];

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'lecture': return 'primary';
      case 'tutorial': return 'secondary';
      case 'practical': return 'success';
      case 'discussion': return 'info';
      default: return 'default';
    }
  };

  const handleDayChange = (event, newValue) => {
    setSelectedDay(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ScheduleIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          My Timetable
        </Typography>
      </Box>

      {/* Day Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedDay}
          onChange={handleDayChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {weeklySchedule.map((day, index) => (
            <Tab key={day.day} label={day.day} />
          ))}
        </Tabs>
      </Paper>

      {/* Selected Day Schedule */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main }}>
          {weeklySchedule[selectedDay].day} Schedule
        </Typography>

        {weeklySchedule[selectedDay].classes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No classes scheduled for {weeklySchedule[selectedDay].day}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {weeklySchedule[selectedDay].classes.map((classItem, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: `2px solid ${theme.palette[getTypeColor(classItem.type)].main}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {classItem.time}
                      </Typography>
                      <Chip 
                        label={classItem.type} 
                        size="small" 
                        color={getTypeColor(classItem.type)}
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="h6" gutterBottom fontWeight="600">
                      {classItem.subject}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {classItem.teacher}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {classItem.room}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Weekly Overview */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Weekly Overview
        </Typography>
        <Grid container spacing={2}>
          {weeklySchedule.map((day, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={day.day}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {day.day}
                </Typography>
                <Typography variant="h4" color="primary">
                  {day.classes.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Classes
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export { StudentTimetable };
