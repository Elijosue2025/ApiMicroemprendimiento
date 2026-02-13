// src/application/use-cases/pedido/ListarPedidosUsuario.js
const ListarPedidosDTO = require('../../dtos/ListarPedidosDTO');

module.exports = async function ListarPedidosUsuario(id_usuario, repo) {
  const rows = await repo.listarPorUsuario(id_usuario);
  return rows.map(row => new ListarPedidosDTO(row));
};