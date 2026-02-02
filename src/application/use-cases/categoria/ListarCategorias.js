class ListarCategorias {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar() {
    return await this.repository.obtenerTodas();
  }
}

module.exports = ListarCategorias;
