// src/application/dtos/PedidoCompletoDTO.js
const DetallePedidoItemDTO = require('./DetallePedidoItemDTO');

class PedidoCompletoDTO {
  constructor(rows) {
    if (!rows || rows.length === 0) throw new Error('No hay datos del pedido');

    const row = rows[0];

    this.id_pedido     = row.id_pedido;
    this.id_usuario    = row.id_usuario;
    this.nombre_usuario = row.nombre_usuario?.trim() || 'Usuario eliminado';
    this.fecha_pedido  = row.fecha_pedido;
    this.estado        = row.estado;
    this.total         = Number(row.total).toFixed(2);
    this.notas_cliente = row.notas_cliente || '';

    this.detalles = rows.map(r => new DetallePedidoItemDTO(r));
  }
}

module.exports = PedidoCompletoDTO;