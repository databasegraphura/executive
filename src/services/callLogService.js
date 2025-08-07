// src/services/callLogService.js
import api from './api';

const callLogService = {
  createCallLog: async (callLogData) => {
    try {
      const response = await api.post('/calllogs', callLogData);
      return response.data.data.callLog;
    } catch (error) {
      console.error('Error creating call log:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getAllCallLogs: async (filters = {}) => {
    try {
      const response = await api.get('/calllogs', { params: filters });
      return response.data.data.callLogs;
    } catch (error) {
      console.error('Error fetching all call logs:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getCallLog: async (id) => {
    try {
      const response = await api.get(`/calllogs/${id}`);
      return response.data.data.callLog;
    } catch (error) {
      console.error('Error fetching call log:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateCallLog: async (id, callLogData) => {
    try {
      const response = await api.patch(`/calllogs/${id}`, callLogData);
      return response.data.data.callLog;
    } catch (error) {
      console.error('Error updating call log:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default callLogService;