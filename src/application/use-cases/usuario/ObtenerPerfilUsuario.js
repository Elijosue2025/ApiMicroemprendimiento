module.exports = async function ObtenerPerfilUsuario(userId, repo) {
  const usuario = await repo.obtenerPorId(userId);

  if (!usuario) {
    throw new Error('USUARIO_NO_ENCONTRADO');
  }

  return usuario;
};