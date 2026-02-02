const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');

router.post('/', controller.crear);
router.get('/microemprendedor/:id', controller.listarPorMicroemprendedor);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
