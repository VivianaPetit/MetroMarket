const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoria');

router.get('/', async (req, res) => {
  const categorias = await Categoria.find();
  res.json(categorias);
});

router.post('/', async (req, res) => {
  const nuevaCategoria = new Categoria(req.body);
  await nuevaCategoria.save();
  res.json(nuevaCategoria);
});

module.exports = router;
