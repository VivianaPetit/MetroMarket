import axios from "axios";
import { Resena } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const ResenaURL = `${API_BASE_URL}/resenas`;

export const createResena = async (
  nuevaResena: Omit<Resena, '_id'>
): Promise<Resena> => {
  try {
    const response = await axios.post(ResenaURL, nuevaResena);

    // Verifica si viene el _id
    const ResenaCreada: Resena = response.data;

    if (!ResenaCreada._id) {
      throw new Error('El backend no devolvió el _id del usuario.');
    }

    return ResenaCreada;
  } catch (error) {
    console.error('Error creando el usuario:', error);
    throw error;
  }
  
};

export const fetchResena = async (): Promise<Resena[]> => {
  try {
    const response = await axios.get<Resena[]>(ResenaURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching transacciones:', error);
    throw error;
  }
};
