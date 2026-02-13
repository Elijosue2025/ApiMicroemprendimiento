const express = require('express');
const router = express.Router();

// Importa el middleware CORRECTO para usuarios
const authUser = require('../middlewares/authUser');   // ← este es el que verifica role 'usuario'

// Importa el controlador de usuarios
const ctrl = require('../controllers/usuarioController');
// O si prefieres nombre más claro:
// const usuarioController = require('../controllers/usuarioController');

router.post('/', ctrl.registrar);                // registro
router.post('/login', ctrl.login);               // login

// Rutas protegidas → usan el middleware authUser
router.get('/perfil', authUser, ctrl.perfil);
router.put('/perfil', authUser, ctrl.actualizar);
router.delete('/cuenta', authUser, ctrl.desactivar);
// o si quieres ruta más clara: router.delete('/desactivar', authUser, ctrl.desactivar);

module.exports = router;