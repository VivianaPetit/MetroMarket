const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tipo: String, 
  categoria: String,
  precio: Number,
  cantidad: Number,
  fotos: [String],
  estado: String, 
  fechaPublicacion: { type: Date, default: Date.now },
  disponible: Boolean,
  lugarEntrega: String,
  vendedor: Object,
  metodoPago: String,
  preguntas: [String],
});


module.exports = mongoose.model('Publicacion', publicacionSchema);
