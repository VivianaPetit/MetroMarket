export interface Categoria {
  _id: string;
  nombre: string;
  foto: string 
}

export interface Usuario {
  _id: string,
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string;
  foto: string;
  publicaciones: string[];  
  favoritos: string[];
  transacciones: string[];
}

export interface Publicacion {
  _id: string;
  usuario : string;
  tipo: string;
  categoria: string;
  descripcion: string;
  cantidad: number;
  estado: string;
  disponible: boolean;
  lugarEntrega: string;
  titulo: string;
  precio: number;
  metodoPago: string;
  fotos: string[];
  preguntas: [string];
  modalidad: string;
  horario:Record<string, string[]>;
  esPatrocinada: boolean
}

export interface Resena {
  _id: string,
  usuario: string;
  resenado: string;
  comentario: string;
  fecha: Date;
  calificacion: number; 
}

export interface Transaccions {
  _id: string,
  comprador: string;
  vendedor: string;
  publicacion: string;
  fecha: Date;
  cantidadComprada: number,
  monto: number; 
  estado: string;
  metodoPago: string;
  entregado: boolean[];

}
