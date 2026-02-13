// src/http/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');
const authUser = require('../middlewares/authUser');   // middleware para consumidores (usuarios)
const authMicro = require('../middlewares/authMicro'); // middleware para microemprendedores

console.log('📦 Cargando rutas de pedidos...');
console.log('authUser existe:', typeof authUser);
console.log('authMicro existe:', typeof authMicro);

// ============================================
// RUTAS PARA MICROEMPRENDEDORES (PRIMERO)
// ============================================
router.get('/recibidos', authMicro, pedidoController.listarPedidosRecibidos); 
router.put('/:id/aprobar', authMicro, pedidoController.aprobarPedido);
router.put('/:id/cancelar', authMicro, pedidoController.cancelarPedido);

// ============================================
// RUTAS PARA CONSUMIDORES (USUARIOS)
// ============================================
router.post('/', authUser, pedidoController.crear);
router.get('/mis-pedidos', authUser, pedidoController.listarMisPedidos);
router.get('/:id', authUser, pedidoController.detallePedido);

module.exports = router;