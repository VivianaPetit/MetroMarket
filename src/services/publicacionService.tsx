import axios from "axios";
import { Publicacion } from '../interfaces/types';

const publicacionesURL = "http://192.168.68.109:3000/api/publicaciones";

export const fetchPublicaciones = async (): Promise<Publicacion[]> => {
  try {
    const response = await axios.get<Publicacion[]>(publicacionesURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching publicaciones:', error);
    throw error;
  }
};
