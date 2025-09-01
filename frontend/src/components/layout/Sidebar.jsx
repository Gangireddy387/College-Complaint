import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  School,
  People,
  Group,
  Close as CloseIcon,
  AccountCircle,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    text: 'Departments',
    icon: <School />,
    path: '/departments',
  },
  {
    text: 'Faculties',
    icon: <People />,
    path: '/faculties',
  },
  {
    text: 'Students',
    icon: <Group />,
    path: '/students',
  },
  {
    text: 'College Profile',
    icon: <Settings />,
    path: '/college-profile',
  },
];

const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
         <Drawer
       variant="permanent"
       sx={{
         width: drawerWidth,
         flexShrink: 0,
                   '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            color: 'white',
            borderRight: 'none !important',
            border: 'none !important',
            borderLeft: 'none !important',
            borderTop: 'none !important',
            borderBottom: 'none !important',
            outline: 'none !important',
            boxShadow: '2px 0 20px rgba(0,0,0,0.3)',
          },
         display: { xs: 'none', md: 'block' },
       }}
     >
      {/* Mobile overlay drawer */}
             <Drawer
         variant="temporary"
         open={open}
         onClose={onToggle}
         sx={{
           display: { xs: 'block', md: 'none' },
                       '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              color: 'white',
              borderRight: 'none !important',
              border: 'none !important',
              borderLeft: 'none !important',
              borderTop: 'none !important',
              borderBottom: 'none !important',
              outline: 'none !important',
              boxShadow: '2px 0 20px rgba(0,0,0,0.3)',
            },
         }}
       >
                 <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
           <IconButton onClick={onToggle} sx={{ color: 'white' }}>
             <CloseIcon />
           </IconButton>
         </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 1 }} />
        {/* Mobile drawer content */}
        <Box sx={{ pt: 2 }}>
          {/* User Profile */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                fontSize: '1.5rem',
                mx: 'auto',
                mb: 1,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              {user?.first_name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Chip
              label="Principal"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </Box>
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
          
          {/* Navigation Menu */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 0,
                    mb: 0.5,
                    backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                    backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive(item.path) ? 'bold' : 'normal',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Desktop sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        
        
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 1 }} />
        
        {/* User Profile */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
                              background: 'linear-gradient(45deg, #e94560, #f39c12)',
              fontSize: '2rem',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            }}
          >
            {user?.first_name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Chip
            label="Principal"
            size="small"
            sx={{
                              background: 'linear-gradient(45deg, #e94560, #f39c12)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            {user?.email}
          </Typography>
        </Box>
        
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 1 }} />
        
        {/* Navigation Menu */}
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 0,
                  mb: 0.5,
                  backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                  backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateX(5px)',
                    transition: 'all 0.3s ease',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
