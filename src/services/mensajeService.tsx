import axios from "axios";
import { Mensaje } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const MENSAJES_URL = `${API_BASE_URL}/mensajes`;
const TRANSACCIONES_URL = `${API_BASE_URL}/transacciones`;

// Obtener mensajes de una transacción
export const getMensajesByTransaccion = async (transaccionId: string): Promise<Mensaje[]> => {
  // La ruta correcta es en transacciones
  const { data } = await axios.get(`${TRANSACCIONES_URL}/${transaccionId}/mensajes`);
  return data.mensajes; // según el backend, ya vienen los mensajes completos
};

// Crear un mensaje y agregarlo a la transacción
export const crearMensaje = async (mensaje: Partial<Mensaje>, transaccionId: string): Promise<Mensaje> => {
  // Crear mensaje
  const { data: nuevoMensaje } = await axios.post(MENSAJES_URL, mensaje);

  // Agregar mensaje a la transacción
  await axios.patch(`${TRANSACCIONES_URL}/${transaccionId}/agregar-mensaje`, {
    mensajeId: nuevoMensaje._id
  });

  return nuevoMensaje;
};
