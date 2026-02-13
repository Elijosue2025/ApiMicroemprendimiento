// src/application/dtos/DetallePedidoItemDTO.js
class DetallePedidoItemDTO {
  constructor(row) {
    this.id_detalle       = row.id_detalle;
    this.id_producto      = row.id_producto;
    this.nombre_producto  = row.nombre_producto?.trim() || 'Producto eliminado';
    this.cantidad         = row.cantidad;
    this.precio_unitario  = Number(row.precio_unitario).toFixed(2);
    this.subtotal         = Number(row.subtotal).toFixed(2);
    this.imagen_producto  = row.url_imagen || '/img/default-product.jpg';
  }
}

module.exports = DetallePedidoItemDTO;