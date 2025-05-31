require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors());
app.use(express.json());

// Rutas
const publicacionesRoutes = require('./routes/publicaciones');
app.use('/api/publicaciones', publicacionesRoutes);

const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

const transaccionesRoutes = require('./routes/transacciones');
app.use('/api/transacciones', transaccionesRoutes);

const resenasRoutes = require('./routes/resenas');
app.use('/api/resenas', resenasRoutes);



// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
