import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  Notifications,
  School,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutPrincipal } from '../../store/slices/authSlice';
import { getCollegeProfile } from '../../store/slices/collegeSlice';

const Navbar = ({ onSidebarToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { college } = useSelector((state) => state.college);

  const [anchorEl, setAnchorEl] = React.useState(null);

  // Fetch college data when component mounts
  useEffect(() => {
    if (!college) {
      dispatch(getCollegeProfile());
    }
  }, [dispatch, college]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutPrincipal()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleClose();
  };

  const handleProfile = () => {
    console.log('Navigating to profile...');
    try {
      navigate('/profile');
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
    }
    handleClose();
  };

  const handleSettings = () => {
    // Navigate to settings page
    handleClose();
  };

  // Get the title to display
  const getTitle = () => {
    if (college && college.name) {
      return college.name;
    }
    return 'College Management System';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - 280px)` },
        ml: { md: '280px' },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: theme.zIndex.drawer + 1,
        backdropFilter: 'blur(10px)',
        borderRadius: 0,
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <School sx={{ mr: 1, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              maxWidth: { xs: '200px', sm: '300px', md: '400px' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {getTitle()}
          </Typography>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)',
                transition: 'all 0.3s ease',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Notifications />
          </IconButton>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {user?.first_name} {user?.last_name}
              </Typography>
                             <Chip
                 label="Principal"
                 size="small"
                 sx={{
                   background: 'linear-gradient(45deg, #e94560, #f39c12)',
                   color: 'white',
                   fontSize: '0.7rem',
                   height: 20,
                   boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                 }}
               />
            </Box>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease',
                },
                transition: 'all 0.3s ease',
              }}
            >
                             <Avatar
                 sx={{
                   width: 40,
                   height: 40,
                   background: 'linear-gradient(45deg, #e94560, #f39c12)',
                   fontSize: '1rem',
                   boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                 }}
               >
                {user?.first_name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
                             background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          {/* User Info */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
                         <Avatar
               sx={{
                 width: 50,
                 height: 50,
                 background: 'linear-gradient(45deg, #e94560, #f39c12)',
                 fontSize: '1.2rem',
                 mx: 'auto',
                 mb: 1,
                 boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
               }}
             >
              {user?.first_name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              {user?.email}
            </Typography>
            <Chip
              label="Principal"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #e94560, #f39c12)',
                color: 'white',
                mt: 1,
                fontSize: '0.7rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </Box>
          
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          
          <MenuItem 
            onClick={handleProfile}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateX(5px)',
                transition: 'all 0.3s ease',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          
          <MenuItem 
            onClick={handleSettings}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateX(5px)',
                transition: 'all 0.3s ease',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Settings sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          
          <MenuItem 
            onClick={handleLogout} 
                         sx={{ 
               color: '#e94560',
              '&:hover': {
                                 backgroundColor: 'rgba(233,69,96,0.1)',
                transform: 'translateX(5px)',
                transition: 'all 0.3s ease',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Logout sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
