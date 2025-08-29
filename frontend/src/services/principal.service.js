import api from './api';

export const principalService = {
  getDashboardStats: async () => {
    const response = await api.get('/principal/dashboard');
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('/principal/departments');
    return response.data;
  },

  getDepartmentById: async (departmentId) => {
    const response = await api.get(`/principal/departments/${departmentId}`);
    return response.data;
  },

  updateDepartment: async (departmentId, data) => {
    const response = await api.put(`/principal/departments/${departmentId}`, data);
    return response.data;
  },

  assignHOD: async (departmentId, facultyId) => {
    const response = await api.post(`/principal/departments/${departmentId}/hod`, {
      facultyId,
    });
    return response.data;
  },

  getAllComplaints: async (params) => {
    const response = await api.get('/principal/complaints', { params });
    return response.data;
  },

  handleComplaint: async (complaintId, actionData) => {
    const response = await api.put(
      `/principal/complaints/${complaintId}`,
      actionData
    );
    return response.data;
  },

  getFacultyStats: async () => {
    const response = await api.get('/principal/faculty/stats');
    return response.data;
  },

  getStudentStats: async () => {
    const response = await api.get('/principal/students/stats');
    return response.data;
  },

  getAttendanceStats: async (params) => {
    const response = await api.get('/principal/attendance/stats', { params });
    return response.data;
  },
};
