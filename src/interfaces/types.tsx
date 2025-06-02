export interface Categoria {
  _id: string;
  nombre: string;
}

export interface Usuario {
  _id: string,
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string;
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
  fotos: string[];  
}
