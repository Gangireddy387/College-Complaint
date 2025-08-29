import api from './api';

// Default login credentials for testing
export const DEFAULT_CREDENTIALS = {
  principal: {
    email: 'principal@college.edu',
    password: 'principal123',
    role: 'principal'
  },
  faculty: {
    email: 'faculty@college.edu',
    password: 'faculty123',
    role: 'faculty'
  },
  student: {
    email: 'student@college.edu',
    password: 'student123',
    role: 'student'
  }
};

export const authService = {
  // Login with credentials
  async login(credentials) {
    try {
      // For demo purposes, check against default credentials first
      const defaultCred = DEFAULT_CREDENTIALS[credentials.role];
      if (defaultCred &&
          defaultCred.email === credentials.email &&
          defaultCred.password === credentials.password) {

        // Return mock user data for demo
        const mockUser = this.getMockUser(credentials.role);
        const mockToken = 'mock-jwt-token-' + Date.now();

        // Store in localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));

        return {
          success: true,
          data: {
            user: mockUser,
            token: mockToken
          }
        };
      }

      // If not default credentials, make API call
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout
  async logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Get mock user data for demo purposes
  getMockUser(role) {
    const baseUser = {
      id: Date.now(),
      email: DEFAULT_CREDENTIALS[role].email,
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    switch (role) {
      case 'principal':
        return {
          ...baseUser,
          first_name: 'Dr. John',
          last_name: 'Principal',
          designation: 'Principal',
          phone_number: '+1-555-0123',
          department_id: 1,
          employee_id: 'PR001',
          joining_date: '2020-01-01',
          qualifications: [{ degree: 'Ph.D. in Education', institution: 'University of Education', year: 2015, percentage: '95%' }],
          experience: [{ position: 'Professor', organization: 'University of Education', from_date: '2010-01-01', to_date: '2019-12-31', description: 'Teaching and research in education' }],
          specializations: ['Educational Leadership', 'Higher Education Management'],
          status: 'active'
        };

      case 'faculty':
        return {
          ...baseUser,
          first_name: 'Prof. Jane',
          last_name: 'Smith',
          designation: 'Associate Professor',
          phone_number: '+1-555-0124',
          department_id: 1,
          employee_id: 'FC001',
          joining_date: '2021-03-01',
          qualifications: [{ degree: 'Ph.D. in Computer Science', institution: 'IIT Delhi', year: 2018, percentage: '92%' }],
          experience: [{ position: 'Assistant Professor', organization: 'NIT Surathkal', from_date: '2018-01-01', to_date: '2021-02-28', description: 'Teaching and research in computer science' }],
          specializations: ['Software Engineering', 'Database Systems'],
          publications: [{ title: 'Modern Software Development', journal: 'Computer Science Journal', year: 2020, doi: '10.1000/xyz789' }],
          achievements: [{ title: 'Best Teacher Award', year: 2020, description: 'Recognition for teaching excellence' }],
          current_workload: 16,
          status: 'active'
        };

      case 'student':
        return {
          ...baseUser,
          first_name: 'Alice',
          last_name: 'Johnson',
          student_id: 'CS001',
          phone_number: '+1-555-0125',
          department_id: 1,
          section_id: 1,
          date_of_birth: '2000-05-15',
          gender: 'female',
          address: { street: '123 Student St', city: 'College Town', state: 'State', pincode: '12345' },
          guardian_info: { name: 'Mr. Robert Johnson', phone: '+1-555-0126', relationship: 'Father' },
          academic_history: [{ year: '2022-2023', semester: 1, cgpa: 8.5 }],
          achievements: [{ title: 'Dean\'s List', year: 2023, description: 'Academic excellence award' }],
          status: 'active',
          semester: 3
        };

      default:
        return baseUser;
    }
  }
};
