// src/application/dtos/ProductoListaCategoriaDTO.js
class ProductoListaCategoriaDTO {
  constructor(row) {
    this.id_producto       = row.id_producto;
    this.nombre            = row.nombre.trim();
    this.descripcion       = row.descripcion ? row.descripcion.trim().substring(0, 120) + '...' : null;
    this.precio            = Number(row.precio).toFixed(2);
    this.stock             = row.stock || 0;
    this.destacado         = row.destacado === 1;
    this.imagen_principal  = row.url_imagen || 'img/default-product.jpg'; // primera imagen o default
    this.categoria_nombre  = row.categoria ? row.categoria.trim() : 'Sin categoría';
    this.microemprendedor_nombre = row.microemprendedor ? row.microemprendedor.trim() : 'Anónimo';
  }
}

module.exports = ProductoListaCategoriaDTO;