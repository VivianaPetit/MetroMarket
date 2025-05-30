// models/Publicacion.js
const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tipo: String, // Producto, Servicio o Divisas
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
  preguntas: [String],
  reseñas: [{
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    comentario: String,
    fecha: { type: Date, default: Date.now }
  }],
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
