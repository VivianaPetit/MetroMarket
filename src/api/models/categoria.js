const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  id: Number,
  categoria: String,
});

module.exports = mongoose.model('Categoria', categoriaSchema);