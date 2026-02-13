const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'usuario_secret_key';

module.exports = {
  generarToken: (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '8h' });
  },

  verificarToken: (token) => {
    return jwt.verify(token, SECRET);
  }
};
