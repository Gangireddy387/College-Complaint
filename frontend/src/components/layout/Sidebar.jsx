import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const getNavigationItems = (userRole) => {
  const baseItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: `/${userRole}/dashboard`,
    },
  ];

  const studentItems = [
    {
      text: 'Attendance',
      icon: <TimelineIcon />,
      path: `/${userRole}/attendance`,
    },
    {
      text: 'Timetable',
      icon: <BookIcon />,
      path: `/${userRole}/timetable`,
    },
    {
      text: 'Subjects',
      icon: <SchoolIcon />,
      path: `/${userRole}/subjects`,
    },
    {
      text: 'Sections',
      icon: <GroupIcon />,
      path: `/${userRole}/sections`,
    },
  ];

  const facultyItems = [
    {
      text: 'Classes',
      icon: <SchoolIcon />,
      path: `/${userRole}/classes`,
    },
    {
      text: 'Mark Attendance',
      icon: <TimelineIcon />,
      path: `/${userRole}/attendance`,
    },
    {
      text: 'Forms',
      icon: <AssignmentIcon />,
      path: `/${userRole}/forms`,
    },
    {
      text: 'Complaints',
      icon: <AssignmentIcon />,
      path: `/${userRole}/complaints`,
    },
    {
      text: 'Timetable',
      icon: <BookIcon />,
      path: `/${userRole}/timetable`,
    },
  ];

  const principalItems = [
    {
      text: 'Management',
      icon: <SettingsIcon />,
      path: `/${userRole}/management`,
    },
    {
      text: 'Departments',
      icon: <BusinessIcon />,
      path: `/${userRole}/departments`,
    },
    {
      text: 'Faculty',
      icon: <PeopleIcon />,
      path: `/${userRole}/faculty`,
    },
    {
      text: 'Student Management',
      icon: <PeopleIcon />,
      path: `/${userRole}/students`,
    },
    {
      text: 'Forms',
      icon: <AssignmentIcon />,
      path: `/${userRole}/forms`,
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: `/${userRole}/reports`,
    },
  ];

  switch (userRole) {
    case 'student':
      return [...baseItems, ...studentItems];

    case 'faculty':
      return [...baseItems, ...facultyItems];

    case 'principal':
      return [...baseItems, ...principalItems];

    default:
      return baseItems;
  }
};

export const Sidebar = ({ open, onClose, userRole, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = getNavigationItems(userRole);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6" color="primary">
            {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} Portal
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: isMobile, // Better open performance on mobile.
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};
