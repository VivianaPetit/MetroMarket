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

router.post('/bulk', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Se esperaba un array de cat' });

    }

    const resultado = await Categoria.insertMany(req.body);
    
    res.status(201).json({
      count: resultado.length,
      categorias: resultado
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear categorias',
      details: error.message 
    });
  }
});

module.exports = router;
