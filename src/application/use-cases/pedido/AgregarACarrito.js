// src/application/use-cases/pedido/AgregarACarrito.js
const CarritoItemDTO = require('../../dtos/CarritoItemDTO');

module.exports = async function AgregarACarrito(data, pedidoRepo, productoRepo) {
  const { id_usuario, id_producto, cantidad } = data;

  if (!id_usuario || !id_producto || !cantidad || cantidad <= 0) {
    throw new Error('Datos inválidos para agregar al carrito');
  }

  // Verificar stock del producto
  const producto = await productoRepo.obtenerPorId(id_producto);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }
  if (producto.stock < cantidad) {
    throw new Error('Stock insuficiente');
  }

  // Obtener o crear pedido pendiente
  let pedido = await pedidoRepo.obtenerPendientePorUsuario(id_usuario);
  if (!pedido) {
    pedido = await pedidoRepo.crearPendiente(id_usuario);
  }

  // Agregar detalle al pedido
  const detalleData = {
    id_pedido: pedido.id_pedido,
    id_producto,
    cantidad,
    precio_unitario: producto.precio
  };

  const detalle = await pedidoRepo.agregarDetalle(detalleData);

  // Reducir stock (en transacción si posible)
  await productoRepo.reducirStock(id_producto, cantidad);

  return new CarritoItemDTO(detalle);
};