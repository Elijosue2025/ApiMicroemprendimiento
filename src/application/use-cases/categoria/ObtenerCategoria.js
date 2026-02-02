class ObtenerCategoria {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(id) {
    return await this.repository.obtenerPorId(id);
  }
}

module.exports = ObtenerCategoria;
