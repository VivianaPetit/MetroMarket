const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  publicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' },
  cantidadComprada: Number, 
  monto: { type: Number },
  fechaTransaccion: { type: Date, default: Date.now },
  estado: { type: String, enum: ['Pendiente', 'Completada', 'Cancelada'], default: 'Pendiente' },
  metodoPago: String,
  resenaComprador: { type: mongoose.Schema.Types.ObjectId, ref: 'Resena' }, 
  resenaVendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Resena' },
  entregado: { type: [Boolean], default: [false, false] },
  mensajes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mensaje' }],
});

module.exports = mongoose.model('Transaccion', transaccionSchema);
