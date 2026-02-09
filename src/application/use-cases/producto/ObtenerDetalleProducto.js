const ProductoDetalleDTO = require('../../dtos/ProductoDetalleDTO');

class ObtenerDetalleProducto {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute(idProducto) {
    const rows = await this.productoRepository.obtenerDetallePorId(idProducto);

    if (!rows || rows.length === 0) {
      throw new Error('Producto no encontrado');
    }

    return new ProductoDetalleDTO(rows);
  }
}

module.exports = ObtenerDetalleProducto;
