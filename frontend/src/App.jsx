import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { theme } from './theme';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/auth/Login';
import { StudentDashboard, StudentList, StudentProfile, StudentAttendance, StudentTimetable, StudentSubjects, StudentSections } from './pages/students';
import { FacultyDashboard, FacultyClasses, FacultyComplaints, FacultyTimetable, FacultyAttendance } from './pages/faculty';
import { PrincipalDashboard, Management, DepartmentManagement, FacultyManagement, AddDepartment, AddFaculty, AddStudent } from './pages/principal';
import { checkAuthStatus } from './store/slices/authSlice';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MainLayout>
                <Routes>
                                     <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
                   <Route path="/dashboard" element={<StudentDashboard />} />
                   <Route path="/profile" element={<StudentProfile />} />
                   <Route path="/profile/:id" element={<StudentProfile />} />
                   <Route path="/attendance" element={<StudentAttendance />} />
                   <Route path="/timetable" element={<StudentTimetable />} />
                   <Route path="/subjects" element={<StudentSubjects />} />
                   <Route path="/sections" element={<StudentSections />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/*"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <MainLayout>
                <Routes>
                                     <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />
                   <Route path="/dashboard" element={<FacultyDashboard />} />
                   <Route path="/classes" element={<FacultyClasses />} />
                   <Route path="/complaints" element={<FacultyComplaints />} />
                   <Route path="/timetable" element={<FacultyTimetable />} />
                   <Route path="/attendance" element={<FacultyAttendance />} />
                   {/* Add more faculty routes here */}
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Principal Routes */}
        <Route
          path="/principal/*"
          element={
            <ProtectedRoute allowedRoles={['principal']}>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/principal/dashboard" replace />} />
                  <Route path="/dashboard" element={<PrincipalDashboard />} />
                  <Route path="/management" element={<Management />} />
                                      <Route path="/departments" element={<DepartmentManagement />} />
                    <Route path="/departments/add" element={<AddDepartment />} />
                    <Route path="/faculty" element={<FacultyManagement />} />
                    <Route path="/faculty/add" element={<AddFaculty />} />
                                                        <Route path="/students" element={<StudentList />} />
                   <Route path="/students/add" element={<AddStudent />} />
                  {/* Add more principal routes here */}
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
