const mongoose = require('mongoose');
const resenaSchema = require('./resena'); 

const transaccionSchema = new mongoose.Schema({
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  publicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' },
  monto: Number,
  fechaTransaccion: { type: Date, default: Date.now },
  estado: { type: String, enum: ['Pendiente', 'Completada', 'Cancelada'], default: 'Pendiente' },
  metodoPago: String,
  resenaComprador: resenaSchema, 
  resenaVendedor: resenaSchema,
});

module.exports = mongoose.model('Transaccion', transaccionSchema);
