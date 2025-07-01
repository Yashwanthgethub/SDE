import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getDocuments = async (deleted = false) => {
  try {
    const res = await axios.get(API_URL + `?deleted=${deleted}`, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error('getDocuments error:', err?.response || err);
    throw err;
  }
};

export const createDocument = async (title, content, visibility = 'private') => {
  const res = await axios.post(API_URL, { title, content, visibility }, getAuthHeaders());
  return res.data;
};

export const updateDocument = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await axios.patch(`${API_URL}/${id}/soft-delete`, {}, getAuthHeaders());
  return res.data;
};

export const restoreDocument = async (id) => {
  const res = await axios.patch(`${API_URL}/${id}/restore`, {}, getAuthHeaders());
  return res.data;
};

export const permanentlyDeleteDocument = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}/permanent`, getAuthHeaders());
  return res.data;
};

export const addCollaborator = async (docId, email, permission) => {
  const res = await axios.post(`${API_URL}/${docId}/collaborators`, { email, permission }, getAuthHeaders());
  return res.data;
};

export const removeCollaborator = async (docId, userId) => {
  const res = await axios.delete(`${API_URL}/${docId}/collaborators`, { data: { userId } }, getAuthHeaders());
  return res.data;
};

export const updateCollaboratorPermission = async (docId, userId, permission) => {
  const res = await axios.patch(`${API_URL}/${docId}/collaborators`, { userId, permission }, getAuthHeaders());
  return res.data;
};

export const searchDocuments = async (query) => {
  const res = await axios.get(`${API_URL}/search?q=${encodeURIComponent(query)}`, getAuthHeaders());
  return res.data;
};

export const getDocumentById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

export const getMyDocuments = async () => {
  const res = await axios.get(API_URL + '/my', getAuthHeaders());
  return res.data;
};

export const getTrashDocuments = async () => {
  const res = await axios.get(API_URL + '/trash', getAuthHeaders());
  return res.data;
}; 