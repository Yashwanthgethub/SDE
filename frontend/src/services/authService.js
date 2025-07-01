import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

export const register = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const getNotifications = async () => {
  const res = await axios.get(`${API_URL}/notifications`);
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await axios.patch(`${API_URL}/notifications/${id}/read`);
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return res.data;
};

export const updateMe = async (data) => {
  const res = await axios.put(`${API_URL}/me`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return res.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await axios.post(`${API_URL}/change-password`, { oldPassword, newPassword }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return res.data;
}; 