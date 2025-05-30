const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  nroTransaccion: { type: String, unique: true },
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  publicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' },
  monto: Number,
  fechaTransaccion: { type: Date, default: Date.now },
  estado: { type: String, enum: ['Pendiente', 'Completada', 'Cancelada'], default: 'Pendiente' },
  metodoPago: String,
  calificacionComprador: {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    calificacion: Number,
    comentario: String,
    fecha: { type: Date, default: Date.now }
    },

});

module.exports = mongoose.model('Transaccion', transaccionSchema);
