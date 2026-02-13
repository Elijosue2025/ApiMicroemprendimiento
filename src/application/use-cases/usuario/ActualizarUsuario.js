module.exports = async function ActualizarUsuario(userId, data, repo) {
  const actualizado = await repo.actualizar(userId, data);

  if (!actualizado) {
    throw new Error('NO_SE_PUDO_ACTUALIZAR_USUARIO');
  }

  return await repo.obtenerPorId(userId);
};