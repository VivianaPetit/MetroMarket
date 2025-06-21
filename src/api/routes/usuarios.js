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

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al buscar usuario por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.patch('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { nombre, telefono } = req.body;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (nombre !== undefined) usuario.nombre = nombre;
    if (telefono !== undefined) usuario.telefono = telefono;

    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
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

// para insertar multiples usuarios
router.post('/bulk', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Se esperaba un array de usuarios' });

    }

    const resultado = await Usuario.insertMany(req.body);
    
    res.status(201).json({
      count: resultado.length,
      usuarios: resultado
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear usuarios',
      details: error.message 
    });
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

router.patch('/:userId/transacciones', async (req, res) => {
  const { userId } = req.params;
  const { transaccionId } = req.body;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Inicializar el array si no existe
    if (!usuario.transacciones) {
      usuario.transacciones = [];
    }

    // Verificar si la transacción ya existe para evitar duplicados
    if (!usuario.transacciones.includes(transaccionId)) {
      usuario.transacciones.push(transaccionId);
      await usuario.save();
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al agregar transacción al usuario:', error);
    res.status(500).json({ 
      error: 'Error al agregar la transacción al usuario.',
      details: error.message 
    });
  }
});

// Agregar una publicación a un usuario en favoritos
router.patch('/:userId/favoritos', async (req, res) => {
  const { userId } = req.params;
  const { publicacionId } = req.body;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (!usuario.favoritos) {
      usuario.favoritos = [];
    }

    usuario.favoritos.push(publicacionId);

    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar la publicación al usuario en favoritos.' });
  }
});

// Eliminar una publicación a un usuario en favoritos
router.delete('/:userId/favoritos/:publicacionId', async (req, res) => {
  const { userId, publicacionId } = req.params;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    usuario.favoritos = usuario.favoritos.filter(
      favId => favId.toString() !== publicacionId
    );
    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la publicación al usuario en favoritos.' });
  }
});

//buscar usuario por su correo
router.get('/buscarPorCorreo/:correo', async (req, res) => {  // Usa `:correo` como parámetro
  const { correo } = req.params;  

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
