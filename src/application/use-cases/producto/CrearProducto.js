module.exports = async function CrearProducto(data, repo) {
  return await repo.crear(data);
};
