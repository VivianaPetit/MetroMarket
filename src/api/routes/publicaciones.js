
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


// Para insertar multiples publicaciones
router.post('/bulk', async (req, res) => {
  try {
    // Verificar que el cuerpo de la petición sea un array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ 
        success: false,
        error: 'El cuerpo de la petición debe ser un array de publicaciones' 
      });
    }

    // Validar que todas las publicaciones tengan los campos requeridos
    const publicacionesValidas = req.body.map(pub => {
      const nuevaPub = new Publicacion(pub);
      // Aquí puedes agregar validaciones adicionales si es necesario
      return nuevaPub;
    });

    // Insertar todas las publicaciones en una sola operación
    const resultado = await Publicacion.insertMany(publicacionesValidas);

    res.status(201).json({
      success: true,
      count: resultado.length,
      data: resultado
    });

  } catch (error) {
    console.error('Error al insertar publicaciones:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar las publicaciones'
    });
  }
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

