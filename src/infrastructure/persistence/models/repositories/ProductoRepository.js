const { pool } = require('../../../config/database');

class ProductoRepository {

  async microemprendedorExiste(id) {
    const [rows] = await pool.query(
      'SELECT 1 FROM microemprendedores WHERE id_microemprendedor = ? AND estado = 1',
      [id]
    );
    return rows.length > 0;
  }

  async categoriaExiste(id) {
    const [rows] = await pool.query(
      'SELECT 1 FROM categorias WHERE id_categoria = ? AND estado = 1',
      [id]
    );
    return rows.length > 0;
  }

  async crear(data) {
    const {
      id_microemprendedor,
      id_categoria,
      nombre,
      descripcion,
      precio,
      destacado
    } = data;

    if (!await this.microemprendedorExiste(id_microemprendedor)) {
      throw new Error('Microemprendedor no existe');
    }

    if (!await this.categoriaExiste(id_categoria)) {
      throw new Error('Categoría no existe');
    }

    const [result] = await pool.query(
      `INSERT INTO productos
       (id_microemprendedor, id_categoria, nombre, descripcion, precio, destacado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_microemprendedor, id_categoria, nombre, descripcion, precio, destacado]
    );

    return { id_producto: result.insertId, ...data };
  }

  async listarPorMicroemprendedor(id_microemprendedor) {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.destacado,
        c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_microemprendedor = ?
        AND p.estado = 1
    `, [id_microemprendedor]);

    return rows;
  }

  async actualizar(id_producto, id_microemprendedor, data) {
    const { nombre, descripcion, precio, id_categoria, destacado } = data;

    const [result] = await pool.query(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, destacado = ?
       WHERE id_producto = ? AND id_microemprendedor = ?`,
      [nombre, descripcion, precio, id_categoria, destacado, id_producto, id_microemprendedor]
    );

    if (result.affectedRows === 0) {
      throw new Error('Producto no existe o no pertenece al microemprendedor');
    }

    return { id_producto, ...data };
  }

  async darDeBaja(id_producto, id_microemprendedor) {
    const [result] = await pool.query(
      `UPDATE productos 
       SET estado = 0
       WHERE id_producto = ? AND id_microemprendedor = ?`,
      [id_producto, id_microemprendedor]
    );

    if (result.affectedRows === 0) {
      throw new Error('Producto no existe o no pertenece al microemprendedor');
    }

    return { eliminado: true };
  }
}

module.exports = ProductoRepository;
