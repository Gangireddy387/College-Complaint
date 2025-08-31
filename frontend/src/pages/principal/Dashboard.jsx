import React from 'react';
import { useSelector } from 'react-redux';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import MainLayout from '../../layouts/MainLayout';

const PrincipalDashboard = () => {
  const { user, isLoading, error } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Principal Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.first_name} {user?.last_name}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Statistics
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="h3">12</Typography>
                      <Typography variant="body1">Departments</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                      <Typography variant="h3">45</Typography>
                      <Typography variant="body1">Faculty Members</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                      <Typography variant="h3">1,250</Typography>
                      <Typography variant="body1">Students</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                      <Typography variant="h3">8</Typography>
                      <Typography variant="body1">Pending Complaints</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default PrincipalDashboard;
