// src/application/use-cases/pedido/CrearPedido.js
const PedidoDTO = require('../../dtos/PedidoDTO');

module.exports = async function CrearPedido(data, repo) {
  // data: { id_usuario, detalles: [{ id_producto, cantidad }] }

  // Validaciones (ej: stock disponible)
  for (const item of data.detalles) {
    const producto = await repo.obtenerProducto(item.id_producto);
    if (producto.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }
  }

  // Crear pedido
  const id_pedido = await repo.crearPedido(data.id_usuario, data.total);

  // Crear detalles y reducir stock
  for (const item of data.detalles) {
    await repo.crearDetalle(id_pedido, item);
    await repo.reducirStock(item.id_producto, item.cantidad);
  }

  // Devolver DTO
  const rows = await repo.obtenerDetallePedido(id_pedido);
  return new PedidoDTO(rows);
};