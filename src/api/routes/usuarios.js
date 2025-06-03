const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
});

// Agregar una publicación a un usuario
router.patch('/:userId/publicaciones', async (req, res) => {
  const { userId } = req.params;
  const { publicacionId } = req.body;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (!usuario.publicaciones) {
      usuario.publicaciones = [];
    }

    usuario.publicaciones.push(publicacionId);

    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar la publicación al usuario.' });
  }
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
