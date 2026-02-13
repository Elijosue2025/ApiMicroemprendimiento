const bcrypt = require('bcryptjs');

module.exports = async function CrearUsuario(data, repo) {
  if (!data.email) {
    throw new Error('EMAIL_REQUERIDO');
  }

  if (!data.password || data.password.length < 6) {
    throw new Error('PASSWORD_INVALIDO');
  }

  const hashed = await bcrypt.hash(data.password, 10);

  const usuarioData = {
    nombre: data.nombre || null,
    email: data.email,
    password: hashed,
    estado: data.estado ?? 1
  };

  return await repo.crear(usuarioData);
};