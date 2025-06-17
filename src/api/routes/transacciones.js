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
