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
  useMediaQuery,
  Collapse,
  IconButton,
  Tooltip,
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
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

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
      text: 'Profile',
      icon: <PersonIcon />,
      path: `/${userRole}/profile`,
    },
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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const navigationItems = getNavigationItems(userRole);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: isSmallScreen ? 1.5 : 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon 
            color="primary" 
            sx={{ 
              fontSize: isSmallScreen ? '1.5rem' : '2rem',
            }} 
          />
          <Typography 
            variant={isSmallScreen ? "subtitle1" : "h6"} 
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} Portal
          </Typography>
        </Box>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem 
                key={item.text} 
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: isSmallScreen ? 1 : 2,
                    borderRadius: 2,
                    minHeight: isSmallScreen ? 48 : 56,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: isSmallScreen ? 36 : 40,
                      color: isActive ? 'inherit' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: isSmallScreen ? '0.875rem' : '1rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          p: isSmallScreen ? 1.5 : 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ textAlign: 'center', display: 'block' }}
        >
          College Management System
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: isMobile,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: isMobile ? 3 : 1,
          ...(isMobile && {
            width: '100%',
            maxWidth: '320px',
          }),
        },
        ...(isMobile && {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }),
      }}
    >
      {drawer}
    </Drawer>
  );
};
