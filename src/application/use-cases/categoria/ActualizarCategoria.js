class ActualizarCategoria {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id, data) {
    return await this.repository.actualizar(id, data);
  }
}

module.exports = ActualizarCategoria;
