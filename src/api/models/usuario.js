const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, unique: true, required: true },
    contrasena: { type: String, required: true },
    telefono: { type: String, required: true },
    calificacionPromedio: { type: Number, default: 0 },
    publicaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' }],
    nivelReputacion: { type: String, default: 'Bronce' }, // Oro, Plata, Bronce (???)
    transacciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaccion' }],
    fechaRegistro: { type: Date, default: Date.now },
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' }],
});

usuarioSchema.pre('save', function(next) {
    if (!this.transacciones || this.transacciones.length === 0) {
        this.calificacion = null; 
    } else {
        // Calcula el promedio de las calificaciones
        const total = this.transacciones.reduce((sum, t) => sum + (t.calificacion || 0), 0);
        this.calificacion = total / this.transacciones.length; 
    }
    next(); 
});

module.exports = mongoose.model('Usuario', usuarioSchema);
