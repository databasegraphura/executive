// src/services/reportService.js
import api from './api'; // Our configured axios instance

const reportService = {
  getDashboardSummary: async () => {
    try {
      const response = await api.get('/reports/dashboard-summary');
      return response.data.data; // The backend wraps data in { status, data: { ... } }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getPerformanceReport: async (period, teamLeadId) => {
    try {
      const params = { period };
      if (teamLeadId) {
        params.teamLeadId = teamLeadId;
      }
      const response = await api.get('/reports/performance', { params });
      return response.data.data.report;
    } catch (error) {
      console.error('Error fetching performance report:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getManagerCallReport: async (filters) => {
    try {
      const response = await api.get('/reports/manager-calls', { params: filters });
      return response.data.data.callLogs;
    } catch (error) {
      console.error('Error fetching manager call report:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getActivityLogs: async () => {
    try {
      const response = await api.get('/reports/activity-logs');
      return response.data.data.activityLogs;
    } catch (error) {
      console.error('Error fetching activity logs:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default reportService;