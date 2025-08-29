import api from './api';

export const facultyService = {
  getAll: async (params) => {
    const response = await api.get('/faculty', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/faculty/${id}`);
    return response.data;
  },

  getClasses: async (facultyId) => {
    const response = await api.get(`/faculty/${facultyId}/classes`);
    return response.data;
  },

  markAttendance: async (facultyId, classId, attendanceData) => {
    const response = await api.post(
      `/faculty/${facultyId}/classes/${classId}/attendance`,
      attendanceData
    );
    return response.data;
  },

  updateAttendance: async (facultyId, classId, attendanceId, attendanceData) => {
    const response = await api.put(
      `/faculty/${facultyId}/classes/${classId}/attendance/${attendanceId}`,
      attendanceData
    );
    return response.data;
  },

  getComplaints: async (facultyId, params) => {
    const response = await api.get(`/faculty/${facultyId}/complaints`, { params });
    return response.data;
  },

  handleComplaint: async (facultyId, complaintId, actionData) => {
    const response = await api.put(
      `/faculty/${facultyId}/complaints/${complaintId}`,
      actionData
    );
    return response.data;
  },

  getTimeTable: async (facultyId) => {
    const response = await api.get(`/faculty/${facultyId}/timetable`);
    return response.data;
  },

  getSubjects: async (facultyId) => {
    const response = await api.get(`/faculty/${facultyId}/subjects`);
    return response.data;
  },
};
