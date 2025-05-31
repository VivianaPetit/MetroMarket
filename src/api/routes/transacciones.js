const express = require('express');
const router = express.Router();
const Transaccion = require('../models/transaccion');

router.get('/', async (req, res) => {
  const transacciones = await Transaccion.find()
    .populate('comprador', 'nombre')
    .populate('vendedor', 'nombre')
    .populate('publicacion', 'titulo');
  res.json(transacciones);
});

router.post('/', async (req, res) => {
  const nuevaTransaccion = new Transaccion(req.body);
  await nuevaTransaccion.save();
  res.json(nuevaTransaccion);
});

module.exports = router;
