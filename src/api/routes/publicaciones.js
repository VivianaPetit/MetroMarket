
const express = require('express');
const router = express.Router();
const Publicacion = require('../models/publicacion');

router.get('/', async (req, res) => {
  const publicaciones = await Publicacion.find();
  res.json(publicaciones);
});

router.get('/:id', async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id);
    
    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    res.json(publicacion);
  } catch (error) {
    console.error(`Error obteniendo publicación con id ${req.params.id}:`, error);
    res.status(500).json({ mensaje: 'Error del servidor al obtener la publicación' });
  }
});

router.post('/', async (req, res) => {
  const nuevaPublicacion = new Publicacion(req.body);
  await nuevaPublicacion.save();
  res.json(nuevaPublicacion);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const publicacion = await Publicacion.findByIdAndDelete(id);

    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    res.json({ mensaje: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error(`Error eliminando publicación con id ${id}:`, error);
    res.status(500).json({ mensaje: 'Error del servidor al eliminar la publicación' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const dataActualizada = req.body;

  try {
    const publicacion = await Publicacion.findByIdAndUpdate(id, dataActualizada, {
      new: true,
    });

    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    res.json(publicacion);
  } catch (error) {
    console.error(`Error actualizando publicación con id ${id}:`, error);
    res.status(500).json({ mensaje: 'Error del servidor al actualizar la publicación' });
  }
});

module.exports = router;

