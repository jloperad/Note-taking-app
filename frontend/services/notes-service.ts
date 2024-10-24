import axios from 'axios';
import { Note } from '../app/page';

const API_URL = 'http://localhost:3001/api/notes'; // Adjust the port if necessary

export const getActiveNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch active notes.');
  }
};

export const getArchivedNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(`${API_URL}/archived`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch archived notes.');
  }
};

export const createNote = async (note: Note): Promise<Note> => {
  try {
    const response = await axios.post(API_URL, note);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create note.');
  }
};

export const updateNote = async (id: number, note: Note): Promise<Note> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, note);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update note.');
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Failed to delete note.');
  }
};

export const toggleArchiveStatus = async (id: number): Promise<Note> => {
  try {
    const response = await axios.put(`${API_URL}/${id}/archive`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to toggle archive status.');
  }
};
