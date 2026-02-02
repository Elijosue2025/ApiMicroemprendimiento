class EliminarProducto {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id_producto, id_microemprendedor) {
    return await this.repository.darDeBaja(id_producto, id_microemprendedor);
  }
}
module.exports = EliminarProducto;
