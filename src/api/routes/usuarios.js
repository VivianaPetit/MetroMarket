const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

router.get('/', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

router.post('/', async (req, res) => {
  const nuevoUsuario = new Usuario(req.body);
  await nuevoUsuario.save();
  res.json(nuevoUsuario);
});

// Buscar usuario por correo con validación de dominio
router.post('/buscarPorCorreo', async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'El correo es obligatorio' });
  }

  const dominioValido = /@correo\.unimet\.edu\.ve$|@unimet\.edu\.ve$/;
  if (!dominioValido.test(correo)) {
    return res.status(400).json({ mensaje: 'Correo no permitido' });
  }

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario); 
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


module.exports = router;
