import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Person,
  Settings,
  Logout,
  School,
  Notifications,
} from '@mui/icons-material';

export const Navbar = ({ onSidebarToggle, onLogout, user, isMobile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || 'User';
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    return user?.email?.charAt(0) || 'U';
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: '100%',
        zIndex: 1100,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        background: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: isSmallScreen ? 64 : 72,
          px: isSmallScreen ? 2 : 3,
          py: 1,
          justifyContent: 'flex-end', // Align everything to the right
        }}
      >
        {/* User Info and Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              borderRadius: 2,
            }}
          >
            <Badge badgeContent={3} color="error" size="small">
              <Notifications fontSize="small" />
            </Badge>
          </IconButton>

          {/* User Role Chip */}
          <Chip
            label={user?.role?.toUpperCase() || 'USER'}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              fontSize: '0.7rem',
              height: 24,
              fontWeight: 600,
              borderWidth: 1.5,
            }}
          />

          {/* User Name */}
          <Typography 
            variant="body2" 
            sx={{ 
              display: { xs: 'none', lg: 'block' },
              fontWeight: 600,
              color: 'text.primary',
              mx: 1,
            }}
          >
            {getUserDisplayName()}
          </Typography>
          
          {/* User Avatar */}
          <IconButton
            size="medium"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              borderRadius: 2,
              ml: 1,
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '2px solid',
                borderColor: 'primary.light',
              }}
            >
              {getUserInitials()}
            </Avatar>
          </IconButton>
          
          {/* User Menu */}
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
                minWidth: 220,
                mt: 1,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            {/* User Info Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48,
                    bgcolor: 'primary.main',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    mr: 2,
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {getUserDisplayName()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || 'No email'}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={user?.role?.toUpperCase() || 'USER'}
                size="small"
                color="primary"
                variant="filled"
                sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <MenuItem onClick={handleClose} sx={{ py: 2, px: 3 }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="My Profile" 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{ py: 2, px: 3 }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ py: 2, px: 3, color: 'error.main' }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Sign Out" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
