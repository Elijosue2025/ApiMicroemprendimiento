class CrearPedido {
  constructor(pedidoRepository, detalleRepository) {
    this.pedidoRepository = pedidoRepository;
    this.detalleRepository = detalleRepository;
  }

  async execute({ id_usuario, id_microemprendedor, productos }) {
    const pedidoId = await this.pedidoRepository.create({
      id_usuario,
      id_microemprendedor
    });

    let total = 0;

    for (const p of productos) {
      total += p.cantidad * p.precio;
      await this.detalleRepository.create({
        id_pedido: pedidoId,
        ...p
      });
    }

    await this.pedidoRepository.updateTotal(pedidoId, total);
    return pedidoId;
  }
}

module.exports = CrearPedido;
