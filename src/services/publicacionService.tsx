import axios from "axios";
import { Publicacion } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const publicacionesURL = `${API_BASE_URL}/publicaciones`;


export const fetchPublicaciones = async (): Promise<Publicacion[]> => {
  try {
    const response = await axios.get<Publicacion[]>(publicacionesURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching publicaciones:', error);
    throw error;
  }
  };

export const crearPublicacion = async (publicacion: Partial<Publicacion>): Promise<Publicacion> => {
  try {
    const response = await axios.post(publicacionesURL, publicacion);
    return response.data;
  } catch (error) {
    console.error('Error creando publicación:', error);
    throw error;
  }
};

