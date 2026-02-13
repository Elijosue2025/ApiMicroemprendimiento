// src/application/use-cases/producto/ListarProductosPorCategoria.js
const ProductoListaCategoriaDTO = require('../../dtos/ProductoListaCategoriaDTO');

module.exports = async function ListarProductosPorCategoria(id_categoria, repo) {
  if (!id_categoria || isNaN(id_categoria)) {
    throw new Error('ID de categoría inválido');
  }

  const productos = await repo.listarPorCategoria(id_categoria);

  // Transformar cada fila en DTO
  return productos.map(row => new ProductoListaCategoriaDTO(row));
};