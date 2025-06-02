import axios from "axios";
import { Usuario } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const usuariosURL = `${API_BASE_URL}/usuarios`;

export const fetchPublicaciones = async (): Promise<Usuario[]> => {
  try {
    const response = await axios.get<Usuario[]>(usuariosURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
};

export const createUsuario = async (
  nuevoUsuario: Omit<Usuario, '_id'>
): Promise<Usuario> => {
  try {
    const response = await axios.post(usuariosURL, nuevoUsuario);

    // Verifica si viene el _id
    const usuarioCreado: Usuario = response.data;

    if (!usuarioCreado._id) {
      throw new Error('El backend no devolvió el _id del usuario.');
    }

    return usuarioCreado;
  } catch (error) {
    console.error('Error creando el usuario:', error);
    throw error;
  }
};


