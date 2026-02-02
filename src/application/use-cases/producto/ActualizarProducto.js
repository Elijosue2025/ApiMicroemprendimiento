class ActualizarProducto {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id_producto, id_microemprendedor, data) {
    return await this.repository.actualizar(id_producto, id_microemprendedor, data);
  }
}
module.exports = ActualizarProducto;
