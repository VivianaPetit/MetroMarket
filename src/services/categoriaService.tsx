import axios from "axios";
import { Categoria } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const categoriasURL = `${API_BASE_URL}/categorias`;

export const fetchCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await axios.get<Categoria[]>(categoriasURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching categorias:', error);
    throw error;
  }
};
