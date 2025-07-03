import axios from "axios";
import { Mensaje } from '../interfaces/types';
import { Transaccions } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const MENSAJES_URL = `${API_BASE_URL}/mensajes`;
const TRANSACCIONES_URL = `${API_BASE_URL}/transacciones`;


// Obtener mensajes de una transacción
export const getMensajesByTransaccion = async (transaccionId: string): Promise<Mensaje[]> => {
  // La ruta correcta es en transacciones
  const { data } = await axios.get(`${TRANSACCIONES_URL}/${transaccionId}/mensajes`);
  return data.mensajes; // según el backend, ya vienen los mensajes completos
};

export const marcarMensajesComoLeidos = async (transaccionId: string, userId: string) => {
  try {
    const res = await fetch(`${TRANSACCIONES_URL}/${transaccionId}/marcar-leidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error('No se pudieron marcar los mensajes como leídos');

    return await res.json();
  } catch (error) {
    console.error('Error al marcar mensajes como leídos:', error);
    throw error;
  }
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
