const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  publicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' },
  cantidadComprada: Number, 
  monto: { type: mongoose.Schema.Types.Decimal128 },
  fechaTransaccion: { type: Date, default: Date.now },
  estado: { type: String, enum: ['Pendiente', 'Completada', 'Cancelada'], default: 'Pendiente' },
  metodoPago: String,
  resenaComprador: { type: mongoose.Schema.Types.ObjectId, ref: 'Resena' }, 
  resenaVendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Resena' },
  entregado: { type: [Boolean], default: [false, false] },
});

module.exports = mongoose.model('Transaccion', transaccionSchema);
