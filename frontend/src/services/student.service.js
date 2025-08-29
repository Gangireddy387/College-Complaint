import api from './api';

export const studentService = {
  getAll: async (params) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  getAttendance: async (studentId, params) => {
    const response = await api.get(`/students/${studentId}/attendance`, { params });
    return response.data;
  },

  getComplaints: async (studentId, params) => {
    const response = await api.get(`/students/${studentId}/complaints`, { params });
    return response.data;
  },

  submitComplaint: async (studentId, complaintData) => {
    const response = await api.post(`/students/${studentId}/complaints`, complaintData);
    return response.data;
  },

  updateComplaint: async (studentId, complaintId, complaintData) => {
    const response = await api.put(
      `/students/${studentId}/complaints/${complaintId}`,
      complaintData
    );
    return response.data;
  },

  getTimeTable: async (studentId) => {
    const response = await api.get(`/students/${studentId}/timetable`);
    return response.data;
  },

  getSubjects: async (studentId) => {
    const response = await api.get(`/students/${studentId}/subjects`);
    return response.data;
  },
};
