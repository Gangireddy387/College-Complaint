import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import { DEFAULT_CREDENTIALS } from '../../services/auth.service';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'principal' // Changed default role
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const rolePath = user.role.toLowerCase();
      navigate(`/${rolePath}/dashboard`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(login(formData));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickLogin = (role) => { // Added
    const credentials = DEFAULT_CREDENTIALS[role];
    setFormData(credentials);
    dispatch(clearError());
    dispatch(login(credentials));
  };

  const getRoleColor = (role) => { // Added
    switch (role) {
      case 'principal': return 'primary';
      case 'faculty': return 'secondary';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>College Complaint System</Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>Sign in to access your dashboard</Typography>

            {/* Default Credentials Info */}
            <Accordion sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="primary">
                  🚀 Quick Login - Default Credentials
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(DEFAULT_CREDENTIALS).map(([role, cred]) => (
                    <Box key={role} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={role.toUpperCase()}
                        color={getRoleColor(role)}
                        size="small"
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <strong>Email:</strong> {cred.email} | <strong>Password:</strong> {cred.password}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuickLogin(role)}
                        disabled={isLoading}
                      >
                        Quick Login
                      </Button>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={formData.email} onChange={handleChange} disabled={isLoading} />
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={formData.password} onChange={handleChange} disabled={isLoading} />
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select labelId="role-label" id="role" name="role" value={formData.role} label="Role" onChange={handleChange} disabled={isLoading}>
                  <MenuItem value="principal">Principal</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
                {isLoading ? (<CircularProgress size={20} />) : ('Sign In')}
              </Button>
            </Box>

            {/* Demo Info */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                <strong>Demo Mode:</strong> This is a demonstration system with mock data.
                <br />
                Use the default credentials above to explore different user roles.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
