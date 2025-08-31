import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { People } from '@mui/icons-material';
import MainLayout from '../../layouts/MainLayout';

const Faculties = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Faculty Management
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Manage faculty members and their assignments
          </Typography>
        </Box>

        {/* Content */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              elevation={3}
              sx={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%)',
                border: '1px solid rgba(233, 69, 96, 0.2)',
                borderRadius: 3,
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(233, 69, 96, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People 
                    sx={{ 
                      mr: 2, 
                      background: 'linear-gradient(45deg, #e94560, #f39c12)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '2rem',
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    component="h2"
                    sx={{
                      background: 'linear-gradient(135deg, #e94560 0%, #f39c12 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold',
                    }}
                  >
                    Faculty Overview
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                  This page will contain faculty management functionality including:
                </Typography>
                <Box component="ul" sx={{ mt: 2, pl: 3 }}>
                  <Typography 
                    component="li" 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      opacity: 0.8,
                      mb: 0.5,
                      '&:hover': {
                        color: '#e94560',
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View all faculty members
                  </Typography>
                  <Typography 
                    component="li" 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      opacity: 0.8,
                      mb: 0.5,
                      '&:hover': {
                        color: '#e94560',
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add new faculty members
                  </Typography>
                  <Typography 
                    component="li" 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      opacity: 0.8,
                      mb: 0.5,
                      '&:hover': {
                        color: '#e94560',
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Edit faculty profiles
                  </Typography>
                  <Typography 
                    component="li" 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      opacity: 0.8,
                      mb: 0.5,
                      '&:hover': {
                        color: '#e94560',
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Assign departments and subjects
                  </Typography>
                  <Typography 
                    component="li" 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      opacity: 0.8,
                      mb: 0.5,
                      '&:hover': {
                        color: '#e94560',
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View faculty attendance and performance
                  </Typography>
                  <Typography 
                    component="li" 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      opacity: 0.8,
                      mb: 0.5,
                      '&:hover': {
                        color: '#e94560',
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Manage faculty schedules and timetables
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default Faculties;
