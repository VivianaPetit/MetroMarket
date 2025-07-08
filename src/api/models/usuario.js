const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, unique: true, required: true },
    contrasena: { type: String, required: true },
    telefono: { type: String, required: true },
    foto: String,
    calificacionPromedio: { type: Number, default: 0 },
    publicaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' }],
    nivelReputacion: { type: String, default: 'Bronce' }, // Oro, Plata, Bronce (???)
    transacciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaccion' }],
    fechaRegistro: { type: Date, default: Date.now },
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' }],
    transacciones : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaccion' }],
    expoPushToken: { type: String, default: null },
});


module.exports = mongoose.model('Usuario', usuarioSchema);
