require('dotenv').config();
const express = require('express');
const cors = require('cors');

// DB
require('./src/infrastructure/config/database');

// Routes
const microRoutes = require('./src/http/routes/microemprendedoresRoutes');
const categoriasRoutes = require('./src/http/routes/categoriasRoutes');
const productosRoutes = require('./src/http/routes/productosRoutes');

const app = express();

// 🔥 Middlewares (ANTES de las rutas)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', api: 'micromercado' });
});

// Routes
app.use('/api/microemprendedores', microRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);


// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
