import axios from 'axios';
import { Note } from '../app/page';

const API_URL = 'http://localhost:3001/api'; // Adjust the port if necessary

export const getActiveNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(`${API_URL}/notes/active`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch active notes.');
  }
};

export const getArchivedNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(`${API_URL}/notes/archived`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch archived notes.');
  }
};

export const createNote = async (note: Note): Promise<Note> => {
  try {
    const response = await axios.post(`${API_URL}/notes`, note);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create note.');
  }
};

export const updateNote = async (id: number, note: Note): Promise<Note> => {
  try {
    const response = await axios.put(`${API_URL}/notes/${id}`, note);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update note.');
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/notes/${id}`);
  } catch (error) {
    throw new Error('Failed to delete note.');
  }
};

export const toggleArchiveStatus = async (id: number): Promise<Note> => {
  try {
    const response = await axios.put(`${API_URL}/notes/${id}/archive`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to toggle archive status.');
  }
};

export const getNoteById = async (id: number): Promise<Note> => {
  try {
    const response = await axios.get(`${API_URL}/notes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch note by ID.');
  }
};

export const addCategoryToNote = async (noteId: number, categoryId: number): Promise<Note> => {
  try {
    const response = await axios.post(`${API_URL}/notes/${noteId}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add category to note.');
  }
};

export const removeCategoryFromNote = async (noteId: number, categoryId: number): Promise<Note> => {
  try {
    const response = await axios.delete(`${API_URL}/notes/${noteId}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to remove category from note.');
  }
};

export const getNotesByCategory = async (categoryId: number, active?: boolean): Promise<Note[]> => {
  try {
    const url = `${API_URL}/notes/category/${categoryId}${active !== undefined ? `?active=${active}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch notes by category.');
  }
};

export const getCategoriesForNote = async (noteId: number): Promise<{ id: number; name: string; color: string }[]> => {
  try {
    const response = await axios.get(`${API_URL}/notes/${noteId}/categories`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch categories for note.');
  }
};
