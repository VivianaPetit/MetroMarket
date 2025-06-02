export interface Categoria {
  _id: string;
  nombre: string;
}

export interface Usuario {
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string;
}

export interface Publicacion {
  _id: string;
  categoria: string;
  titulo: string;
  precio: number;
  fotos: string[];  
}
