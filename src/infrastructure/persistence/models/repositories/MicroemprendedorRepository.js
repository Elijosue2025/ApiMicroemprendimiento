const { pool } = require('../../../config/database');

module.exports = {
  async listar() {
    const [rows] = await pool.query('SELECT * FROM microemprendedores');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT * FROM microemprendedores WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async crear(data) {
    const { nombre, descripcion, contacto } = data;
    const [result] = await pool.query(
      'INSERT INTO microemprendedores (nombre, descripcion, contacto) VALUES (?, ?, ?)',
      [nombre, descripcion, contacto]
    );
    return { id: result.insertId, ...data };
  },

  async actualizar(id, data) {
    const { nombre, descripcion, contacto } = data;
    await pool.query(
      'UPDATE microemprendedores SET nombre=?, descripcion=?, contacto=? WHERE id=?',
      [nombre, descripcion, contacto, id]
    );
    return { id, ...data };
  },

  async eliminar(id) {
    await pool.query('DELETE FROM microemprendedores WHERE id = ?', [id]);
  }
};
