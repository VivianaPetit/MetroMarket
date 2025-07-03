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

export const agregarTransaccionAUsuario = async (
  userId: string,
  transaccionId: string
): Promise<Usuario> => {
  try {
    const response = await axios.patch(`${usuariosURL}/${userId}/transacciones`, {
      transaccionId
    });
    return response.data;
  } catch (error) {
    console.error('Error agregando transacción al usuario:', error);
    throw error;
  }
};

export const editarUsuario = async (
  userId: string,
  datos: Partial<Pick<Usuario, 'nombre' | 'telefono' | 'foto' >>
): Promise<Usuario> => {
  try {
    const response = await axios.patch<Usuario>(`${usuariosURL}/${userId}`, datos);
    return response.data;
  } catch (error) {
    console.error('Error editando el usuario:', error);
    throw error;
  }
};


export const fetchUsuarioById = async (userId: string): Promise<Usuario> => {
  try {
    const response = await axios.get<Usuario>(`${usuariosURL}/${userId}`);
    console.log(response)
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

export const agregarPublicacionAFavorito = async (
  userId: string,
  publicacionId: string
): Promise<Usuario> => {
  try {
    const response = await axios.patch(`${usuariosURL}/${userId}/favoritos`, {publicacionId,
    });
    return response.data;
  } catch (error) {
    console.error('Error agregando publicación a favoritos', error);
    throw error;
  }
};

export const eliminarPublicacionDeFavorito = async (
  userId: string,
  publicacionId: string
): Promise<Usuario> => {
  try {
    const response = await axios.delete(`${usuariosURL}/${userId}/favoritos/${publicacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando publicación de favoritos', error);
    throw error;
  }
};

//para verificar si una publicacion esta en favoritos
export const fetchFavoritoUsuario = async (userId: string, publicacionId: string): Promise<boolean> => {
  try {
    const response = await axios.get<Usuario>(`${usuariosURL}/${userId}`);
    return response.data.favoritos.includes(publicacionId);
  } catch (error) {
    console.error('Error fetching usuario by ID:', error);
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
    // console.error('No se encontró ese correo en la bdd:', error);
    throw error;
  }
};


export const checkUserVerificationStatus = async (userId: string): Promise<boolean> => {
  try {
    // Llama al endpoint que verifica el número de ventas
    const response = await axios.get(`${usuariosURL}/${userId}/salesCount`);
    return response.data > 50; // Verifica si tiene más de 50 ventas
  } catch (error) {
    console.error('Error al verificar ventas del usuario:', error);
    throw error;
  }
};



