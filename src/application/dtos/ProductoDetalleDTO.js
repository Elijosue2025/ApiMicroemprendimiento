class ProductoDetalleDTO {
  constructor(rows) {
    const row = rows[0];

    this.id_producto = row.id_producto;
    this.nombre = row.nombre;
    this.descripcion = row.descripcion;
    this.precio = Number(row.precio);
    this.destacado = row.destacado === 1;

    this.categoria = {
      id: row.id_categoria,
      nombre: row.categoria
    };

    this.microemprendedor = {
      id: row.id_microemprendedor,
      nombre: row.microemprendedor,
      telefono: row.telefono,
      email: row.email,
      direccion: row.direccion,
      imagen: row.imagen_micro
    };

    this.imagenes = rows
      .filter(r => r.url_imagen)
      .map(r => r.url_imagen);
  }
}

module.exports = ProductoDetalleDTO;
