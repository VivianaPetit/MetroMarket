// models/Publicacion.js
const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tipo: String, // Producto o Servicio
  categoria: String,
  precio: Number,
  cantidad: Number,
  fotos: [String],
  estado: String, 
  fechaPublicacion: Date,
  disponible: Boolean,
  lugarEntrega: String,
  vendedor: Object,
  metodoPago: String,
  preguntas: [String]
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
