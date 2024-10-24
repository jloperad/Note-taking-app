import axios from 'axios';

const API_URL = 'http://localhost:3001/api/notes'; // Adjust the port if necessary

export const getActiveNotes = async () => {
  const response = await axios.get(`${API_URL}/active`);
  return response.data;
};

export const getArchivedNotes = async () => {
  const response = await axios.get(`${API_URL}/archived`);
  return response.data;
};

export const createNote = async (note) => {
  const response = await axios.post(API_URL, note);
  return response.data;
};

export const updateNote = async (id, note) => {
  const response = await axios.put(`${API_URL}/${id}`, note);
  return response.data;
};

export const deleteNote = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const toggleArchiveStatus = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/archive`);
  return response.data;
};

