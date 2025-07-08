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

export const deletePublicacion = async (id: string): Promise<void> => {
  try {
    // En lugar de DELETE, hacemos un PATCH para actualizar solo el campo 'eliminado'
    await axios.patch(`${publicacionesURL}/${id}`, { eliminado: true });
  } catch (error) {
    console.error(`Error eliminando publicación con id ${id}:`, error);
    throw error;
  }
};

export const deletePublicacionCompleto = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${publicacionesURL}/${id}`);
  } catch (error) {
    console.error(`Error eliminando publicación con id ${id}:`, error);
    throw error;
  }
};