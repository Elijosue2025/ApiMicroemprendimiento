const { pool } = require('../../../config/database');
const bcrypt = require('bcryptjs');

class UsuarioRepository {
  async crear(data) {
    const [result] = await pool.execute(
      `INSERT INTO usuarios (nombre, email, password, estado)
       VALUES (?, ?, ?, ?)`,
      [data.nombre || null, data.email, data.password, data.estado ?? 1]
    );

    return {
      id_usuario: result.insertId,
      nombre: data.nombre,
      email: data.email,
      estado: data.estado ?? 1
    };
  }

  async login(email, password) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? AND estado = 1',
      [email]
    );

    if (!rows.length) return null;

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return null;

    delete user.password;
    return user;
  }

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT id_usuario, nombre, email, estado, fecha_registro FROM usuarios WHERE id_usuario = ? AND estado = 1',
      [id]
    );
    return rows[0] || null;
  }

  async actualizar(id, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id_usuario = ?`;
    const [result] = await pool.execute(query, values);

    return result.affectedRows > 0;
  }

  async desactivar(id) {
    const [result] = await pool.execute(
      'UPDATE usuarios SET estado = 0 WHERE id_usuario = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UsuarioRepository;