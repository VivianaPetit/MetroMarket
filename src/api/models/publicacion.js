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

  modalidad:{
    type: String
  },

  horario: {
    type: {
      lunes: [String], // Array de horarios para lunes
      martes: [String],
      miercoles: [String],
      jueves: [String],
      viernes: [String],
      sabado: [String],
      domingo: [String]
    },
    default: {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: []
    }
  }
});

module.exports = mongoose.model('publicacion', publicacionSchema);
