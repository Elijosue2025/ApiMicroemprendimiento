const { pool } = require('../../../config/database');

class CategoriaRepository {

  async obtenerTodas() {
    const [rows] = await pool.query(
      'SELECT * FROM categorias WHERE estado = 1'
    );
    return rows;
  }

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categorias WHERE id_categoria = ?',
      [id]
    );
    return rows[0];
  }

  async crear(data) {
    const { nombre, descripcion } = data;
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    return { id: result.insertId, nombre, descripcion };
  }

  async actualizar(id, data) {
    const { nombre, descripcion, estado } = data;
    await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ?, estado = ? WHERE id_categoria = ?',
      [nombre, descripcion, estado, id]
    );
    return { id, ...data };
  }

  async eliminar(id) {
    await pool.query(
      'UPDATE categorias SET estado = 0 WHERE id_categoria = ?',
      [id]
    );
    return { eliminado: true };
  }
}

module.exports = CategoriaRepository;
