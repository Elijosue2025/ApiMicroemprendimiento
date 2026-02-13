// src/application/dtos/ListarPedidosDTO.js
class ListarPedidosDTO {
  constructor(row) {
    this.id_pedido = row.id_pedido;
    this.fecha_pedido = row.fecha_pedido;
    this.estado = row.estado;
    this.total = Number(row.total).toFixed(2);
    this.cantidad_items = row.cantidad_items || 0;
    this.nombre_usuario = row.nombre_usuario?.trim() || 'Usuario';
    this.notas_cliente = row.notas_cliente || '';
  }
}

module.exports = ListarPedidosDTO;












