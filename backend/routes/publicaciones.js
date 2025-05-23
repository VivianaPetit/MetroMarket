// routes/publicaciones.js
const express = require('express');
const router = express.Router();
const Publicacion = require('../models/publicacion');

router.get('/', async (req, res) => {
  const publicaciones = await Publicacion.find();
  res.json(publicaciones);
});

router.post('/', async (req, res) => {
  const nuevaPublicacion = new Publicacion(req.body);
  await nuevaPublicacion.save();
  res.json(nuevaPublicacion);
});

module.exports = router;
