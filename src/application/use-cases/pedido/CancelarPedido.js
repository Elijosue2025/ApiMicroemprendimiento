// src/application/use-cases/pedido/CancelarPedido.js
module.exports = async function CancelarPedido(id_pedido, id_microemprendedor, repo) {
  const pedido = await repo.obtenerPedido(id_pedido);

  if (pedido.estado !== 'pendiente') {
    throw new Error('Pedido no pendiente');
  }

  // Validar que el pedido tenga productos del micro
  const productos = await repo.obtenerDetallesPedido(id_pedido);
  const esDelMicro = productos.some(p => p.id_microemprendedor === id_microemprendedor);
  if (!esDelMicro) {
    throw new Error('No autorizado para cancelar este pedido');
  }

  await repo.actualizarEstado(id_pedido, 'cancelado');

  // Restaurar stock
  for (const item of productos) {
    await repo.aumentarStock(item.id_producto, item.cantidad);
  }

  return { message: 'Pedido cancelado' };
};