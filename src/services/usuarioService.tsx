import axios from "axios";
import { Usuario } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const usuariosURL = `${API_BASE_URL}/usuarios`;

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await axios.get<Usuario[]>(usuariosURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
};

export const fetchUsuario = async (userId: string): Promise<Usuario> => {
  try {
    const response = await axios.get<Usuario>(`${usuariosURL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching usuario by ID:', error);
    throw error;
  }
};

export const agregarPublicacionAUsuario = async (
  userId: string,
  publicacionId: string
): Promise<Usuario> => {
  try {
    const response = await axios.patch(`${usuariosURL}/${userId}/publicaciones`, {
      publicacionId,
    });
    return response.data;
  } catch (error) {
    console.error('Error agregando publicación al usuario:', error);
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

export const buscarUsuarioPorCorreo = async (correo: string): Promise<Usuario> => {
  try {
    const response = await axios.get<Usuario>(`${usuariosURL}/buscarPorCorreo/${encodeURIComponent(correo)}`);
    return response.data;
  } catch (error) {
    console.error('No se encontró ese correo en la bdd:', error);
    throw error;
  }
};






