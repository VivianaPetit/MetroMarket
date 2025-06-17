// services/usuarioService.ts
import axios from 'axios';

const API_URL = 'http://${LOCAL_IP}:3000/api'; // Cambia a tu URL real (por ejemplo, http://localhost:3000)

export const obtenerUsuarioPorCorreo = async (correo: string) => {
  try {
    const response = await axios.get(`${API_URL}/buscarPorCorreo/${correo}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario por correo:", error);
    throw error;
  }
};

export const editarUsuario = async (userId: string, datos: { nombre: string; telefono: string }) => {
  try {
    const response = await axios.patch(`${API_URL}/${userId}`, datos);
    return response.data;
  } catch (error) {
    console.error("Error al editar usuario:", error);
    throw error;
  }
};
