class Categoria {
  constructor({
    id_categoria,
    nombre,
    descripcion,
    estado
  }) {
    this.id_categoria = id_categoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
  }
}

module.exports = Categoria;
