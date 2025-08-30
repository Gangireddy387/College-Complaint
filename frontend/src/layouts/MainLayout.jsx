import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  useTheme, 
  useMediaQuery,
  Drawer,
  IconButton,
  Fade
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { logout } from '../store/slices/authSlice';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useSelector((state) => state.auth);

  const handleSidebarToggle = () => {
    console.log('Sidebar toggle clicked, current state:', sidebarOpen);
    setIsTransitioning(true);
    setSidebarOpen(!sidebarOpen);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSidebarClose = () => {
    console.log('Sidebar close triggered');
    setIsTransitioning(true);
    setSidebarOpen(false);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleSidebarOpen = () => {
    console.log('Sidebar open triggered');
    setIsTransitioning(true);
    setSidebarOpen(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      handleSidebarClose();
    }
  }, [location.pathname, isMobile]);

  // Handle swipe gestures for mobile
  useEffect(() => {
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      // Swipe right to open sidebar (if closed)
      if (diff < -50 && !sidebarOpen && isMobile) {
        handleSidebarOpen();
      }
      // Swipe left to close sidebar (if open)
      else if (diff > 50 && sidebarOpen && isMobile) {
        handleSidebarClose();
      }
    };

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [sidebarOpen, isMobile]);

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Mobile Menu Button - Completely separate from navbar */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 1300,
            display: { xs: 'block', md: 'none' }
          }}
        >
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: 48,
              height: 48,
              borderRadius: 2,
            }}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

      {/* Navbar - Only contains user controls */}
      <Navbar
        onSidebarToggle={handleSidebarToggle}
        onLogout={handleLogout}
        user={user}
        isMobile={isMobile}
      />

      {/* Mobile Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="left"
          open={sidebarOpen}
          onClose={handleSidebarClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '280px',
              boxSizing: 'border-box',
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              zIndex: 1200,
            },
            zIndex: 1200,
          }}
        >
          <Sidebar
            open={sidebarOpen}
            onClose={handleSidebarClose}
            userRole={user.role}
            isMobile={isMobile}
          />
        </Drawer>
      ) : (
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          userRole={user.role}
          isMobile={isMobile}
        />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'all 0.3s ease-in-out',
          ...(isMobile && {
            p: 2,
            mt: 8,
          }),
          ...(isTablet && !isMobile && {
            p: 3,
            mt: 8,
          }),
          ...(!isTablet && {
            p: 4,
            mt: 8,
            ml: sidebarOpen ? '280px' : 0,
          }),
        }}
      >
        <Fade in={!isTransitioning} timeout={300}>
          <Box
            sx={{
              maxWidth: '100%',
              mx: 'auto',
              ...(isMobile && {
                px: 1,
              }),
              ...(isTablet && !isMobile && {
                px: 2,
              }),
              ...(!isTablet && {
                px: 3,
              }),
            }}
          >
            {children}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};
