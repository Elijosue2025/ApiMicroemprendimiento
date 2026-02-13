// src/application/use-cases/pedido/ListarPedidosMicro.js
const ListarPedidosDTO = require('../../dtos/ListarPedidosDTO');

module.exports = async function ListarPedidosMicro(id_microemprendedor, repo) {
  const rows = await repo.listarPorMicro(id_microemprendedor); // pedidos con productos del micro
  return rows.map(row => new ListarPedidosDTO(row));
};