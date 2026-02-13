const { pool } = require('../../../config/database');

class ProductoRepository {

 async listarTodos() {
  const [rows] = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.stock,
      p.destacado,
      m.nombre AS microemprendedor,
      c.nombre AS categoria,
      (SELECT url_imagen 
       FROM producto_imagenes pi 
       WHERE pi.id_producto = p.id_producto 
       LIMIT 1) AS url_imagen
    FROM productos p
    JOIN microemprendedores m ON p.id_microemprendedor = m.id_microemprendedor
    JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE p.estado = 1
  `);
  return rows;
}

  async listarPorMicroemprendedor(id) {
    const [rows] = await pool.query(`
      SELECT 
        id_producto,
        id_microemprendedor,
        id_categoria,
        nombre,
        descripcion,
        precio,
        stock,
        estado,
        destacado,
        fecha_publicacion
      FROM productos
      WHERE id_microemprendedor = ? AND estado = 1
    `, [id]);
    return rows;
  }

  async listarPorCategoria(id_categoria) {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.destacado,
        c.nombre AS categoria,
        m.nombre AS microemprendedor,
        (SELECT url_imagen 
         FROM producto_imagenes pi 
         WHERE pi.id_producto = p.id_producto 
         LIMIT 1) AS url_imagen
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN microemprendedores m ON p.id_microemprendedor = m.id_microemprendedor
      WHERE p.id_categoria = ? 
        AND p.estado = 1
      GROUP BY p.id_producto
      ORDER BY p.destacado DESC, p.fecha_publicacion DESC
    `, [id_categoria]);

    return rows;
  }

  async obtenerDetallePorId(id) {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
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
      `SELECT 
         id_producto,
         id_microemprendedor,
         id_categoria,
         nombre,
         descripcion,
         precio,
         stock,
         estado,
         destacado,
         fecha_publicacion
       FROM productos 
       WHERE id_producto = ? AND estado = 1`,
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
      destacado = 0,
      stock = 100
    } = data;

    const [result] = await pool.  query(
      `INSERT INTO productos
       (id_microemprendedor, id_categoria, nombre, descripcion, precio, destacado, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_microemprendedor, id_categoria, nombre, descripcion, precio, destacado, stock]
    );

    return { id_producto: result.insertId, ...data, stock };
  }

  async actualizar(id, data) {
    const { nombre, descripcion, precio, id_categoria, destacado, stock } = data;

    const fields = [];
    const values = [];

    if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
    if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
    if (precio !== undefined) { fields.push('precio = ?'); values.push(precio); }
    if (id_categoria !== undefined) { fields.push('id_categoria = ?'); values.push(id_categoria); }
    if (destacado !== undefined) { fields.push('destacado = ?'); values.push(destacado); }
    if (stock !== undefined) { fields.push('stock = ?'); values.push(stock); }

    if (fields.length === 0) return false;

    values.push(id);

    const query = `UPDATE productos SET ${fields.join(', ')} WHERE id_producto = ?`;
    const [result] = await pool.execute(query, values);

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

  // Método útil para cuando agregues al carrito/pedido
  async reducirStock(id_producto, cantidad) {
    const [result] = await pool.execute(
      `UPDATE productos 
       SET stock = stock - ? 
       WHERE id_producto = ? AND stock >= ?`,
      [cantidad, id_producto, cantidad]
    );

    if (result.affectedRows === 0) {
      throw new Error('Stock insuficiente o producto no encontrado');
    }

    return true;
  }
}

module.exports = ProductoRepository;