const PedidoRepository = require('../../infrastructure/persistence/models/repositories/PedidoRepository');
const PedidoCompletoDTO = require('../../application/dtos/PedidoCompletoDTO');
const ListarPedidosDTO = require('../../application/dtos/ListarPedidosDTO');
const repo = new PedidoRepository();

module.exports = {
  crear: async (req, res) => {
    try {
      const id_usuario = req.user.id_usuario || req.user.id; // soporta ambos campos
      const { detalles, notas_cliente = '' } = req.body;

      if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({ message: 'Debe incluir al menos un producto' });
      }

      let total = 0;
      for (const item of detalles) {
        total += item.precio_unitario * item.cantidad;
      }

      const id_pedido = await repo.crearPedido(id_usuario, total, notas_cliente);

      for (const item of detalles) {
        await repo.crearDetalle(id_pedido, {
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.precio_unitario * item.cantidad
        });
      }

      const rows = await repo.obtenerPedidoCompleto(id_pedido);
      const pedidoDTO = new PedidoCompletoDTO(rows);

      res.status(201).json(pedidoDTO);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(400).json({ message: error.message || 'Error al crear pedido' });
    }
  },

  listarMisPedidos: async (req, res) => {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const rows = await repo.listarPorUsuario(id_usuario);
      const pedidos = rows.map(row => new ListarPedidosDTO(row));
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: 'Error al listar pedidos' });
    }
  },

  detallePedido: async (req, res) => {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const id_pedido = req.params.id;

      const rows = await repo.obtenerPedidoCompleto(id_pedido);
      if (rows.length === 0 || rows[0].id_usuario !== id_usuario) {
        return res.status(404).json({ message: 'Pedido no encontrado o no autorizado' });
      }

      const pedidoDTO = new PedidoCompletoDTO(rows);
      res.json(pedidoDTO);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener detalle del pedido' });
    }
  },

  listarPedidosRecibidos: async (req, res) => {
    try {
      const id_micro = req.user.id_microemprendedor || req.user.id;
      const rows = await repo.listarPorMicro(id_micro);
      const pedidos = rows.map(row => new ListarPedidosDTO(row));
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: 'Error al listar pedidos recibidos' });
    }
  },

  aprobarPedido: async (req, res) => {
    try {
      const id_pedido = req.params.id;
      const id_micro = req.user.id_microemprendedor || req.user.id;

      const success = await repo.cambiarEstado(id_pedido, 'aprobado');
      if (!success) {
        return res.status(400).json({ message: 'No se pudo aprobar el pedido' });
      }

      res.json({ message: 'Pedido aprobado exitosamente' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  cancelarPedido: async (req, res) => {
    try {
      const id_pedido = req.params.id;
      const id_micro = req.user.id_microemprendedor || req.user.id;

      const pedido = await repo.obtenerPedidoCompleto(id_pedido);
      if (pedido.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      const esDelMicro = pedido.some(d => d.id_microemprendedor === id_micro);
      if (!esDelMicro) {
        return res.status(403).json({ message: 'No autorizado para este pedido' });
      }

      if (pedido[0].estado !== 'pendiente') {
        return res.status(400).json({ message: 'Solo se pueden cancelar pedidos pendientes' });
      }

      await repo.cambiarEstado(id_pedido, 'cancelado');

      // Restaurar stock
      for (const item of pedido) {
        await repo.aumentarStock(item.id_producto, item.cantidad);
      }

      res.json({ message: 'Pedido cancelado y stock restaurado' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};