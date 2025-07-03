const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, },
  tipo: { type: String, enum: ['Comprador', 'Vendedor'] },
  mensaje: { type: String, trim: true, },
  fecha: { type: Date, default: Date.now, },
  leido: {
    type: Boolean,
    default: false,
  },

});

module.exports = mongoose.model('Mensaje', mensajeSchema);
