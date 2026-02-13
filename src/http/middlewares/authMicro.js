// src/http/middlewares/authMicro.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('=== authMicro Middleware ===');
  console.log('Auth Header:', authHeader ? authHeader.substring(0, 50) + '...' : 'NO EXISTE');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Token no proporcionado o formato incorrecto');
    return res.status(401).json({ message: 'Token requerido (formato Bearer)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', decoded);

    // Mapeo directo (tu token usa "id")
    req.user = {
      id_microemprendedor: decoded.id,
      email: decoded.email,
      role: decoded.role || 'microemprendedor'
    };

    console.log('✅ Usuario asignado a req.user:', req.user);

    if (!req.user.id_microemprendedor) {
      console.log('❌ Token sin ID de microemprendedor');
      return res.status(403).json({ message: 'Token sin ID de microemprendedor' });
    }

    next();
  } catch (err) {
    console.log('❌ Error al verificar token:', err.message);
    return res.status(403).json({ 
      message: 'Token inválido o expirado. Inicia sesión nuevamente.',
      error: err.message
    });
  }
};