module.exports = async function ListarProductosPorMicroemprendedor(
  id_microemprendedor,
  repo
) {
  return await repo.listarPorMicroemprendedor(id_microemprendedor);
};
