require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./src/infrastructure/config/database');

const microRoutes = require('./src/http/routes/microemprendedoresRoutes');
const categoriasRoutes = require('./src/http/routes/categoriasRoutes');
const productosRoutes = require('./src/http/routes/productosRoutes');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', api: 'micromercado' });
});

// Rutas
app.use('/api/microemprendedores', microRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
