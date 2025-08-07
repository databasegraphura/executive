// src/services/userService.js
import api from './api'; // Our configured axios instance

const userService = {
  getMe: async () => {
    try {
      const response = await api.get('/users/getMe');
      return response.data.data.user; // Backend sends { status, data: { user } }
    } catch (error) {
      console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateMe: async (userData) => { // For user to update their own profile
    try {
      const response = await api.patch('/users/getMe', userData); // Backend uses current user ID
      return response.data.data.user;
    } catch (error) {
      console.error('Error updating user profile:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Future: Could add functions for Managers/Team Leads to get/update/delete other users
  getAllUsers: async (filters = {}) => {
    try {
        const response = await api.get('/users', { params: filters });
        return response.data.data.users;
    } catch (error) {
        console.error('Error fetching all users:', error.response ? error.response.data : error.message);
        throw error;
    }
  },

  getUserById: async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data.data.user;
    } catch (error) {
        console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
        throw error;
    }
  },

  updateUser: async (id, userData) => { // For Manager/TL to update other users
    try {
        const response = await api.patch(`/users/${id}`, userData);
        return response.data.data.user;
    } catch (error) {
        console.error('Error updating user by ID:', error.response ? error.response.data : error.message);
        throw error;
    }
  },

  deleteUser: async (id) => { // For Manager to delete users
    try {
        await api.delete(`/users/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        throw error;
    }
  },

  createUser: async (userData) => { // For Manager/TL to create users
    try {
        const response = await api.post('/users/createUser', userData);
        return response.data.data.user;
    } catch (error) {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
        throw error;
    }
  }

};

export default userService;