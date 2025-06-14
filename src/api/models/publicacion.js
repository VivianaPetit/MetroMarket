const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    minlength: [5, 'El título debe tener al menos 5 caracteres'],
    maxlength: [100, 'El título no puede exceder los 100 caracteres'],
    trim: true,
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La descripción no puede exceder los 1000 caracteres'],
    trim: true,
  },
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: {
      values: ['Producto', 'Servicio'],
      message: 'El tipo debe ser "Producto" o "Servicio"',
    },
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad debe ser al menos 1'],
  },
  fotos: [String],
  estado: {
    type: String,
    required: [true, 'El estado es obligatorio'],
    enum: {
      values: ['Nuevo', 'Usado', 'Reparado'],
      message: 'El estado debe ser "Nuevo", "Usado" o "Reparado"',
    },
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
