// services/transaccionService.ts
import axios from "axios";
import { Transaccions } from '../interfaces/types';
import { API_BASE_URL } from '../../config';

const transaccionesURL = `${API_BASE_URL}/transacciones`;

// Obtener todas las transacciones
export const fetchTransacciones = async (): Promise<Transaccions[]> => {
  try {
    const response = await axios.get<Transaccions[]>(transaccionesURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching transacciones:', error);
    throw error;
  }
};

// Crear una nueva transaccións
export const createTransaccion = async (
  nuevaTransaccion: Omit<Transaccions, '_id'>
): Promise<Transaccions> => {
  try {
    const response = await axios.post<Transaccions>(transaccionesURL, nuevaTransaccion);
    if (!response.data._id) throw new Error('El backend no devolvió el _id de la transacción');
    return response.data;
  } catch (error) {
    console.error('Error creando transacción:', error);
    throw error;
  }
};

// Obtener transacción por ID
export const fetchTransaccionById = async (transaccionsId: string): Promise<Transaccions> => {
  try {
    const response = await axios.get<Transaccions>(`${transaccionesURL}/${transaccionsId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transacción by ID:', error);
    throw error;
  }
};



// Confirmar entrega (vendedor o comprador)
export const confirmarEntrega = async (
  transaccionId: string,
  esVendedor: boolean
): Promise<Transaccions> => {
  try {
    const response = await axios.patch<Transaccions>(
      `${transaccionesURL}/${transaccionId}/confirmar-entrega`,
      { esVendedor }
    );
    return response.data;
  } catch (error) {
    console.error('Error confirmando entrega:', error);
    throw error;
  }
};

export const agregarMensajeATransaccion = async (
  transaccionId: string,
  mensajeId: string
): Promise<Transaccions> => {
  try {
    const response = await axios.patch<Transaccions>(
      `${transaccionesURL}/${transaccionId}/agregar-mensaje`,
      { mensajeId }
    );
    return response.data;
  } catch (error) {
    console.error('Error agregando mensaje a transacción:', error);
    throw error;
  }
};

// Obtener transacciones por usuario (comprador o vendedor)
export const fetchTransaccionesByUsuario = async (usuarioId: string): Promise<Transaccions[]> => {
  try {
    const response = await axios.get<Transaccions[]>(`${transaccionesURL}/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transacciones del usuario:', error);
    throw error;
  }
};

export const tieneMensajesNoLeidos = async (
  transaccionId: string,
  userId: string
): Promise<boolean> => {
  try {
    const response = await axios.get<{ tieneNoLeidos: boolean }>(
      `${transaccionesURL}/${transaccionId}/tiene-no-leidos`,
      { params: { userId } }
    );
    return response.data.tieneNoLeidos;
  } catch (error) {
    console.error(`Error verificando mensajes no leídos para transacción ${transaccionId}:`, error);
    return false;
  }
};
