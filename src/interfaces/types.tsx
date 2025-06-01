export interface Categoria {
  _id: string;
  nombre: string;
}

export interface Publicacion {
  _id: string;
  titulo: string;
  precio: number;
  fotos: string[];  
}
