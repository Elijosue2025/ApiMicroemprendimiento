const { pool } = require('../../../config/database');

class ProductoRepository {

  async listarTodos() {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.destacado,
        m.nombre AS microemprendedor,
        c.nombre AS categoria
      FROM productos p
      JOIN microemprendedores m ON p.id_microemprendedor = m.id_microemprendedor
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 1
    `);
    return rows;
  }




  async listarPorMicroemprendedor(id) {
    const [rows] = await pool.query(`
      SELECT *
      FROM productos
      WHERE id_microemprendedor = ? AND estado = 1
    `, [id]);
    return rows;
  }
  async obtenerDetallePorId(id) {
    const [rows] = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.destacado,
      p.id_categoria,
      c.nombre AS categoria,

      m.id_microemprendedor,
      m.nombre AS microemprendedor,
      m.telefono,
      m.email,
      m.direccion,

      pi.url_imagen
    FROM productos p
    JOIN categorias c ON p.id_categoria = c.id_categoria
    JOIN microemprendedores m ON p.id_microemprendedor = m.id_microemprendedor
    LEFT JOIN producto_imagenes pi ON p.id_producto = pi.id_producto
    WHERE p.id_producto = ? AND p.estado = 1
  `, [id]);

    return rows;
  }



  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT * FROM productos WHERE id_producto = ? AND estado = 1`,
      [id]
    );
    return rows[0];
  }

  async crear(data) {
    const {
      id_microemprendedor,
      id_categoria,
      nombre,
      descripcion,
      precio,
      destacado = 0
    } = data;

    const [result] = await pool.query(
      `INSERT INTO productos
       (id_microemprendedor, id_categoria, nombre, descripcion, precio, destacado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_microemprendedor, id_categoria, nombre, descripcion, precio, destacado]
    );

    return { id_producto: result.insertId, ...data };
  }

  async actualizar(id, data) {
    const { nombre, descripcion, precio, id_categoria, destacado } = data;

    const [result] = await pool.query(
      `UPDATE productos
       SET nombre=?, descripcion=?, precio=?, id_categoria=?, destacado=?
       WHERE id_producto=?`,
      [nombre, descripcion, precio, id_categoria, destacado, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Producto no existe');
    }

    return { id_producto: id, ...data };
  }

  async darDeBaja(id) {
    const [result] = await pool.query(
      `UPDATE productos SET estado=0 WHERE id_producto=?`,
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Producto no existe');
    }

    return true;
  }
}

module.exports = ProductoRepository;
