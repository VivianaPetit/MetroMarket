import axios from "axios";
import { Publicacion } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const publicacionesURL = `${API_BASE_URL}/publicaciones`;

export const ServiceCategory = async (): Promise<Publicacion[]> => {
  try {
    const response = await axios.get<Publicacion[]>(publicacionesURL);
    return response.data;
  } catch (error) {
    console.error('Error creando publicación:', error);
    throw error;
  }
};