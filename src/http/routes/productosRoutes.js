    const express = require('express');
    const router = express.Router();

    const productoController = require('../controllers/productoController');
    const authMicro = require('../middlewares/authMicro');
    const upload = require('../../infrastructure/config/multer');
    // RUTAS PÚBLICAS (sin autenticación - para consumidores y visitantes)
    router.get('/', productoController.listarTodos);                        // Lista TODOS los productos (para product.html)
    router.get('/categoria/:id_categoria', productoController.listarPorCategoria); // Filtrar por categoría (tabs)
    router.get('/:id', productoController.obtener);                        // Detalle simple de un producto
    router.get('/:id/detalle', productoController.obtenerDetalle);         // Detalle completo con imágenes

    // RUTAS PRIVADAS (solo microemprendedores logueados)
    router.get('/micro/:id', authMicro, productoController.listarPorMicro); // Mis productos (dashboard del micro)
    router.post('/', authMicro, upload.array('imagenes', 5), productoController.crear); // Crear producto + imágenes
    router.post('/pruebas', authMicro, productoController.crearPruebas);   // Crear sin imágenes (solo pruebas)
    router.put('/:id', authMicro, productoController.actualizar);
    router.delete('/:id', authMicro, productoController.eliminar);

    module.exports = router;