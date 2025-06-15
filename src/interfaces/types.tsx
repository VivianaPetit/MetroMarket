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
  publicaciones: string[];  
  favoritos: string[];
}

export interface Publicacion {
  _id: string;
  usuario : string,
  categoria: string;
  descripcion: string;
  cantidad: string;
  estado: string ;
  disponible: boolean ;
  lugarEntrega : string;
  titulo: string;
  precio: number;
  metodoPago: string,
  fotos: [string];  
  preguntas: [string];
}

export interface Resena {
  _id: string,
  usuario: string;
  comentario: string;
  fecha: Date;
  calificacion: number; 
}