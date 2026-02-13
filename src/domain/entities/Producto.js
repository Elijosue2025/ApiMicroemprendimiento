class Producto {
  constructor({
    id_producto,
    id_microemprendedor,
    id_categoria,
    nombre,
    descripcion,
    precio,
    estado,
    destacado,
    stock,
    fecha_publicacion
  }) {
    this.id_producto = id_producto;
    this.id_microemprendedor = id_microemprendedor;
    this.id_categoria = id_categoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.estado = estado;
    this.destacado = destacado;
    this.stock=stock;
    this.fecha_publicacion = fecha_publicacion;
  }
}
666
module.exports = Producto;
