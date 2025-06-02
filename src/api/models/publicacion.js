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
  metodoPago: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  preguntas: [String],
});


module.exports = mongoose.model('Publicacion', publicacionSchema);
