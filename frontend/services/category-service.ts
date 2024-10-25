import axios from 'axios';

const API_URL = 'https://note-taking-app-33gt.onrender.com/api'; // Adjust the port if necessary

// Update the Category type to include the color property
export type Category = {
  id: number;
  name: string;
  color: string;
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch categories.');
  }
};

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch category by ID.');
  }
};

export const createCategory = async (category: { name: string; color: string }): Promise<Category> => {
  try {
    const response = await axios.post(`${API_URL}/categories`, category);
    return response.data as Category;
  } catch (error) {
    throw new Error('Failed to create category.');
  }
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update category.');
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/categories/${id}`);
  } catch (error) {
    throw new Error('Failed to delete category.');
  }
};
