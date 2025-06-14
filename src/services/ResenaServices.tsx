import axios from "axios";
import { Resena } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const usuariosURL = `${API_BASE_URL}/resenas`;

export const createResena = async (
  nuevoUsuario: Omit<Resena, '_id'>
): Promise<Resena> => {
  try {
    const response = await axios.post(usuariosURL, nuevoUsuario);

    // Verifica si viene el _id
    const usuarioCreado: Resena = response.data;

    if (!usuarioCreado._id) {
      throw new Error('El backend no devolvió el _id del usuario.');
    }

    return usuarioCreado;
  } catch (error) {
    console.error('Error creando el usuario:', error);
    throw error;
  }
  
};
