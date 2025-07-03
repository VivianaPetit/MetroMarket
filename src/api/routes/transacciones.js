const express = require('express');
const router = express.Router();
const Transaccion = require('../models/transaccion');
const Mensaje = require('../models/mensaje'); // Asegúrate de importar el modelo Mensaje
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
  const transacciones = await Transaccion.find()
    .populate('comprador', 'nombre')
    .populate('vendedor', 'nombre')
    .populate('publicacion', 'titulo');
  res.json(transacciones);
});



router.post('/:transaccionId/marcar-leidos', async (req, res) => {
  const { transaccionId } = req.params;
  const { userId } = req.body;

  try {
    const transaccion = await Transaccion.findById(transaccionId).populate('mensajes');

    if (!transaccion) return res.status(404).json({ mensaje: 'Transacción no encontrada' });

    // Actualizar mensajes: marcar como leídos solo los que NO son del usuario que marca
    await Promise.all(
      transaccion.mensajes.map(async (mensaje) => {
        if (mensaje.usuario.toString() !== userId) {
          await Mensaje.findByIdAndUpdate(mensaje._id, { leido: true });
        }
      })
    );

    res.json({ mensaje: 'Mensajes marcados como leídos' });
  } catch (error) {
    console.error('Error marcando mensajes como leídos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.get('/:id/tiene-no-leidos', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  console.log('📥 Params recibidos:', { id, userId });

  if (!userId) {
    return res.status(400).json({ mensaje: 'userId es requerido' });
  }

  try {
    const transaccion = await Transaccion.findById(id);
    if (!transaccion) {
      return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    }

    console.log('📄 Transacción encontrada:', transaccion._id);
    console.log('📨 Mensajes asociados:', transaccion.mensajes);

    if (!transaccion.mensajes || transaccion.mensajes.length === 0) {
      return res.json({ tieneNoLeidos: false });
    }

    const mensajeNoLeido = await Mensaje.exists({
      _id: { $in: transaccion.mensajes },
      usuario: { $ne: new mongoose.Types.ObjectId(userId) },
      leido: false,
    });

    console.log('👀 ¿Hay mensajes no leídos?:', !!mensajeNoLeido);

    res.json({ tieneNoLeidos: !!mensajeNoLeido });
  } catch (error) {
    console.error('❌ Error verificando mensajes no leídos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener todos los mensajes de una transacción específica
router.get('/:transaccionId/mensajes', async (req, res) => {
  try {
    const { transaccionId } = req.params;
    
    // Primero encontramos la transacción y hacemos populate de los mensajes
    const transaccion = await Transaccion.findById(transaccionId)
      .populate({
        path: 'mensajes',
        populate: {
          path: 'usuario',
          select: 'nombre foto' // Selecciona los campos que quieres del usuario
        }
      });

    if (!transaccion) {
      return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    }

    // Ordenamos los mensajes por fecha (más antiguo primero)
    const mensajesOrdenados = transaccion.mensajes.sort((a, b) => a.fecha - b.fecha);

    res.json({
      transaccionId: transaccion._id,
      cantidadMensajes: mensajesOrdenados.length,
      mensajes: mensajesOrdenados
    });
  } catch (error) {
    console.error('Error al obtener mensajes de la transacción:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


router.patch('/:id/agregar-mensaje', async (req, res) => {
  const { id } = req.params;
  const { mensajeId } = req.body;

  try {
    const transaccion = await Transaccion.findByIdAndUpdate(
      id,
      { $push: { mensajes: mensajeId } },
      { new: true }
    );

    if (!transaccion) return res.status(404).json({ mensaje: 'Transacción no encontrada' });

    res.json(transaccion);
  } catch (error) {
    console.error('Error al agregar mensaje a transacción:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.patch('/:id/confirmar-entrega', async (req, res) => {
  const { id } = req.params;
  const { esVendedor } = req.body;

  try {
    const transaccion = await Transaccion.findById(id);

    if (!transaccion) {
      return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    }

    // Aseguramos que entregado está correctamente definido
    if (!Array.isArray(transaccion.entregado) || transaccion.entregado.length < 2) {
      transaccion.entregado = [false, false];
    }

    const index = esVendedor ? 1 : 0;
    transaccion.entregado[index] = true;

    // Si ambos confirmaron, marcamos como 'Completada' (exactamente como en el enum)
    if (transaccion.entregado[0] && transaccion.entregado[1]) {
      transaccion.estado = 'Completada';
    }

    await transaccion.save();

    res.json(transaccion);
  } catch (error) {
    console.error('Error confirmando entrega:', error);
    res.status(500).json({ mensaje: 'Error al confirmar entrega' });
  }
});

router.post('/', async (req, res) => {
  const nuevaTransaccion = new Transaccion(req.body);
  await nuevaTransaccion.save();
  res.json(nuevaTransaccion);
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const usuario = await Transaccion.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al buscar usuario por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener transacciones por usuario (comprador o vendedor)
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;

    const transacciones = await Transaccion.find({
      $or: [{ comprador: usuarioId }, { vendedor: usuarioId }],
    })
      .populate('comprador', 'nombre')
      .populate('vendedor', 'nombre')
      .populate('publicacion', 'titulo');

    res.json(transacciones);
  } catch (error) {
    console.error('Error fetching transacciones del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});



module.exports = router;
