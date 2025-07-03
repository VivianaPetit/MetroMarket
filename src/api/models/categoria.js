const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  descripcion: String,
  foto: String
});

module.exports = mongoose.model('Categoria', categoriaSchema);