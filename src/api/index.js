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

const categoriasRoutes = require('./routes/categorias');
const os = require('os');
app.use('/api/categorias', categoriasRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar MongoDB:', err));

const PORT = process.env.PORT || 3000;
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalIp();

app.listen(PORT, () => console.log(`Servidor corriendo en http://${LOCAL_IP}:${PORT}`));
