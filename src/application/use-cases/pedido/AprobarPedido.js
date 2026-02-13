// src/application/use-cases/pedido/AprobarPedido.js
module.exports = async function AprobarPedido(id_pedido, id_microemprendedor, repo) {
  const pedido = await repo.obtenerPedido(id_pedido);

  if (pedido.estado !== 'pendiente') {
    throw new Error('Pedido no pendiente');
  }

  // Validar que el pedido tenga productos del micro
  const productos = await repo.obtenerDetallesPedido(id_pedido);
  const esDelMicro = productos.some(p => p.id_microemprendedor === id_microemprendedor);
  if (!esDelMicro) {
    throw new Error('No autorizado para aprobar este pedido');
  }

  await repo.actualizarEstado(id_pedido, 'aprobado');

  return { message: 'Pedido aprobado' };
};