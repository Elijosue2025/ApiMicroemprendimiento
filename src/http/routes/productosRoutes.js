const express = require('express');
const router = express.Router();

const productoController = require('../controllers/productoController');

// 🔍 DETALLE COMPLETO (VA PRIMERO)
router.get('/:id/detalle', productoController.obtenerDetalle);

// 📄 TODOS
router.get('/', productoController.listarTodos);

// 📄 POR MICRO
router.get('/micro/:id', productoController.listarPorMicro);

// 🔍 SIMPLE
router.get('/:id', productoController.obtener);

// CRUD
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;
