class ListarProductosPorMicroemprendedor {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id_microemprendedor) {
    return await this.repository.listarPorMicroemprendedor(id_microemprendedor);
  }
}
module.exports = ListarProductosPorMicroemprendedor;
