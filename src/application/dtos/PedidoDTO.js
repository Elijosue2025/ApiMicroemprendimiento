// src/application/dtos/PedidoDTO.js
const DetallePedidoDTO = require('./DetallePedidoDTO');

class PedidoDTO {
  constructor(rows) {
    const row = rows[0];

    this.id_pedido = row.id_pedido;
    this.id_usuario = row.id_usuario;
    this.fecha = row.fecha;
    this.estado = row.estado; // 'pendiente', 'aprobado', 'cancelado'
    this.total = Number(row.total).toFixed(2);

    this.usuario = {
      id: row.id_usuario,
      nombre: row.nombre_usuario ? row.nombre_usuario.trim() : 'Anónimo',
      email: row.email_usuario,
      telefono: row.telefono_usuario
    };

    this.detalles = rows.map(r => new DetallePedidoDTO(r));
  }
}

module.exports = PedidoDTO;