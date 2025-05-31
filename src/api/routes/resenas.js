const express = require('express');
const router = express.Router();
const Resena = require('../models/resena');

router.get('/', async (req, res) => {
  const resenas = await Resena.find().populate('usuario');
  res.json(resenas);
});

router.post('/', async (req, res) => {
  const nuevaResena = new Resena(req.body);
  await nuevaResena.save();
  res.json(nuevaResena);
});

module.exports = router;
