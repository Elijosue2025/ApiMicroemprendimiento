class ListarProductosPublicos {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar() {
    return await this.repository.listarPublicos();
  }
}

module.exports = ListarProductosPublicos;
