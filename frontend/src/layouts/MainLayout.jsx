import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* Navbar */}
        <Navbar onSidebarToggle={handleSidebarToggle} />
        
        {/* Content Area */}
        <Box
          sx={{
            pt: { xs: 8, md: 9 },
            px: { xs: 2, md: 3 },
            py: 3,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
