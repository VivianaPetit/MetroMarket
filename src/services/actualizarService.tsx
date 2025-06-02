import axios from "axios";
import { Publicacion } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const publicacionesURL = `${API_BASE_URL}/publicaciones`;

export const updatePublicacion = async (id: string, data: Partial<Publicacion>): Promise<Publicacion> => {
  try {
    const response = await axios.put<Publicacion>(`${publicacionesURL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando publicación con id ${id}:`, error);
    throw error;
  }
};