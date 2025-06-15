const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
  },
  descripcion: {
    type: String,
  }, 

  tipo: {
    type: String,
  },
  categoria: {
    type: String,
  },
  precio: {
    type: Number,
    min: [0, 'El precio no puede ser negativo'],
  },
  cantidad: {
    type: Number,
  },
  fotos: [String],

  estado: {
    type: String,
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  lugarEntrega: {
    type: String,
  },
  metodoPago: {
    type: String,
  },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },

  preguntas: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
