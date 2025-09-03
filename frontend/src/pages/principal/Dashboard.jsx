import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  School,
  People,
  Person,
  Warning,
  Refresh,
  Business,
  TrendingUp,
  Group,
  EmojiPeople,
  Notifications,
  Schedule,
} from '@mui/icons-material';
import { principalService } from '../../services/principal.service';
import MainLayout from '../../layouts/MainLayout';

const PrincipalDashboard = () => {
  const { user, isLoading, error: authError } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    departments: 0,
    faculty: 0,
    students: 0,
    pendingComplaints: 0,
    recentComplaints: [],
    departmentStats: []
  });
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [departmentsResponse, facultyResponse, complaintsResponse, departmentStatsResponse] = await Promise.all([
        principalService.getDepartments(),
        principalService.getFaculty(),
        principalService.getRecentComplaints(),
        principalService.getDepartmentStats()
      ]);

      setDashboardData({
        departments: departmentsResponse.data?.length || 0,
        faculty: facultyResponse.data?.length || 0,
        students: (facultyResponse.data || []).reduce((sum, f) => sum + (f.total_students || 0), 0),
        pendingComplaints: (complaintsResponse.data || []).filter(c => c.status === 'pending').length,
        recentComplaints: complaintsResponse.data || [],
        departmentStats: departmentStatsResponse.data || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Principal Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Welcome back, {user?.first_name} {user?.last_name}
            </Typography>
          </Box>
          <IconButton 
            onClick={loadDashboardData}
            disabled={loading}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
          </IconButton>
        </Box>

        {(authError || dashboardError) && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setDashboardError('')}>
            {authError || dashboardError}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <School sx={{ mr: 1 }} />
                        <Typography variant="h3">{dashboardData.departments}</Typography>
                      </Box>
                      <Typography variant="body1">Departments</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <People sx={{ mr: 1 }} />
                        <Typography variant="h3">{dashboardData.faculty}</Typography>
                      </Box>
                      <Typography variant="body1">Faculty Members</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Person sx={{ mr: 1 }} />
                        <Typography variant="h3">{dashboardData.students}</Typography>
                      </Box>
                      <Typography variant="body1">Students</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Warning sx={{ mr: 1 }} />
                        <Typography variant="h3">{dashboardData.pendingComplaints}</Typography>
                      </Box>
                      <Typography variant="body1">Pending Complaints</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Complaints */}
          {dashboardData.recentComplaints.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3}
                sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Notifications sx={{ fontSize: 28, mr: 2, opacity: 0.9 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Recent Complaints
                    </Typography>
                  </Box>
                  
                  <Box sx={{ maxHeight: 350, overflow: 'auto', pr: 1 }}>
                    {dashboardData.recentComplaints.map((complaint, index) => (
                      <Box 
                        key={complaint.id || index} 
                        sx={{ 
                          mb: 2.5, 
                          p: 2.5, 
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.15)',
                            transform: 'scale(1.02)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                          {complaint.subject || 'No Subject'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, lineHeight: 1.5 }}>
                          {complaint.description?.substring(0, 100)}...
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Schedule sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: 2, 
                            background: complaint.status === 'pending' ? 'rgba(255, 152, 0, 0.2)' : 
                                        complaint.status === 'resolved' ? 'rgba(76, 175, 80, 0.2)' : 
                                        'rgba(33, 150, 243, 0.2)',
                            border: complaint.status === 'pending' ? '1px solid rgba(255, 152, 0, 0.5)' : 
                                   complaint.status === 'resolved' ? '1px solid rgba(76, 175, 80, 0.5)' : 
                                   '1px solid rgba(33, 150, 243, 0.5)',
                            color: complaint.status === 'pending' ? '#FF9800' : 
                                  complaint.status === 'resolved' ? '#4CAF50' : '#2196F3',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}>
                            {complaint.status}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Department Statistics */}
          {dashboardData.departmentStats.length > 0 && (
            <Grid item xs={12} md={6}>
                             <Card 
                 elevation={3} 
                 sx={{ 
                   borderRadius: 3,
                   background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                   color: 'white',
                   '&:hover': {
                     transform: 'translateY(-4px)',
                     boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)',
                   },
                   transition: 'all 0.3s ease',
                 }}
               >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Business sx={{ fontSize: 28, mr: 2, opacity: 0.9 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Department Overview
                    </Typography>
                  </Box>
                  
                  <Box sx={{ maxHeight: 350, overflow: 'auto', pr: 1 }}>
                    {dashboardData.departmentStats.map((dept, index) => (
                      <Box 
                        key={dept.id || index} 
                        sx={{ 
                          mb: 2.5, 
                          p: 2.5, 
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.15)',
                            transform: 'scale(1.02)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <School sx={{ fontSize: 20, mr: 1.5, opacity: 0.8 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {dept.name}
                          </Typography>
                        </Box>
                        
                                                 <Grid container spacing={2}>
                           <Grid item xs={6}>
                             <Box sx={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               p: 2,
                               borderRadius: 2,
                               background: 'rgba(255, 255, 255, 0.25)',
                               border: '2px solid rgba(255, 255, 255, 0.4)',
                               boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                             }}>
                               <Group sx={{ fontSize: 20, mr: 1.5, color: '#2E7D32' }} />
                               <Box>
                                 <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
                                   Faculty
                                 </Typography>
                                 <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                   {dept.total_faculty || 0}
                                 </Typography>
                               </Box>
                             </Box>
                           </Grid>
                           <Grid item xs={6}>
                             <Box sx={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               p: 2,
                               borderRadius: 2,
                               background: 'rgba(255, 255, 255, 0.25)',
                               border: '2px solid rgba(255, 255, 255, 0.4)',
                               boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                             }}>
                               <EmojiPeople sx={{ fontSize: 20, mr: 1.5, color: '#E65100' }} />
                               <Box>
                                 <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
                                   Students
                                 </Typography>
                                 <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E65100', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                   {dept.total_students || 0}
                                 </Typography>
                               </Box>
                             </Box>
                           </Grid>
                         </Grid>
                        
                        {/* Progress indicator for department activity */}
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                          <TrendingUp sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {dept.total_faculty > 0 ? 'Active Department' : 'New Department'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default PrincipalDashboard;
