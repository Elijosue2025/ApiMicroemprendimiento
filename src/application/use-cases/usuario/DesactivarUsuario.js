module.exports = async function DesactivarUsuario(userId, repo) {
  const exito = await repo.desactivar(userId);

  if (!exito) {
    throw new Error('NO_SE_PUDO_DESACTIVAR_USUARIO');
  }

  return { message: 'Cuenta desactivada correctamente' };
};