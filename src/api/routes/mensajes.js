const express = require('express');
const router = express.Router();
const Mensaje = require('../models/mensaje');

// Obtener todos los mensajes
router.get('/', async (req, res) => {
  try {
    const mensajes = await Mensaje.find().populate('usuario');
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes.' });
  }
});


// Obtener un mensaje por ID
router.get('/:mensajeId', async (req, res) => {
  const { mensajeId } = req.params;
  try {
    const mensaje = await Mensaje.findById(mensajeId).populate('usuario');
    if (!mensaje) {
      return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
    }
    res.json(mensaje);
  } catch (error) {
    console.error('Error al buscar mensaje por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Crear un nuevo mensaje
router.post('/', async (req, res) => {
  try {
    const nuevoMensaje = new Mensaje(req.body);
    await nuevoMensaje.save();
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear el mensaje.',
      details: error.message 
    });
  }
});

// Crear múltiples mensajes
router.post('/bulk', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Se esperaba un array de mensajes' });
    }

    const resultado = await Mensaje.insertMany(req.body);
    
    res.status(201).json({
      count: resultado.length,
      mensajes: resultado
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear mensajes',
      details: error.message 
    });
  }
});

// Actualizar un mensaje
router.patch('/:mensajeId', async (req, res) => {
  const { mensajeId } = req.params;
  const { mensaje, tipo } = req.body;

  try {
    const mensajeActualizado = await Mensaje.findByIdAndUpdate(
      mensajeId,
      { mensaje, tipo },
      { new: true }
    ).populate('usuario');

    if (!mensajeActualizado) {
      return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
    }

    res.json(mensajeActualizado);
  } catch (error) {
    console.error('Error actualizando mensaje:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Eliminar un mensaje
router.delete('/:mensajeId', async (req, res) => {
  const { mensajeId } = req.params;
  
  try {
    const mensajeEliminado = await Mensaje.findByIdAndDelete(mensajeId);
    
    if (!mensajeEliminado) {
      return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
    }
    
    res.json({ mensaje: 'Mensaje eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener mensajes por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  
  try {
    const mensajes = await Mensaje.find({ usuario: usuarioId }).populate('usuario');
    res.json(mensajes);
  } catch (error) {
    console.error('Error obteniendo mensajes por usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener mensajes por tipo (Comprador/Vendedor)
router.get('/tipo/:tipo', async (req, res) => {
  const { tipo } = req.params;
  
  if (!['Comprador', 'Vendedor'].includes(tipo)) {
    return res.status(400).json({ mensaje: 'Tipo debe ser "Comprador" o "Vendedor"' });
  }
  
  try {
    const mensajes = await Mensaje.find({ tipo }).populate('usuario');
    res.json(mensajes);
  } catch (error) {
    console.error('Error obteniendo mensajes por tipo:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;