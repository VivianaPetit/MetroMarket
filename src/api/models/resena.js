const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, },
  comentario: { type: String, required: true, trim: true, },
  fecha: { type: Date, default: Date.now, },
  calificacion: { type: Number, required: true, min: 1, max: 5, },
});

module.exports = resenaSchema;
