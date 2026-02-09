module.exports = async function ActualizarProducto(
  id_producto,
  id_microemprendedor,
  data,
  repo
) {
  return await repo.actualizar(id_producto, id_microemprendedor, data);
};
