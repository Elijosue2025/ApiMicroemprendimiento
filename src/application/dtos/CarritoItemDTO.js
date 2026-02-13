// src/application/dtos/CarritoItemDTO.js
class CarritoItemDTO {
  constructor(item) {
    this.id_detalle = item.id_detalle;
    this.id_producto = item.id_producto;
    this.nombre = item.nombre;
    this.precio_unitario = Number(item.precio_unitario).toFixed(2);
    this.cantidad = item.cantidad;
    this.subtotal = Number(item.subtotal).toFixed(2);
  }
}

module.exports = CarritoItemDTO;