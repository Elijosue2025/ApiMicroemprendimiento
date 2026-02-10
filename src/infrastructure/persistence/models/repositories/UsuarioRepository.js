const db = require('../../../config/db');

class UsuarioRepository {
  async create({ nombre, email, password }) {
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, email, password, estado)
       VALUES (?, ?, ?, 1)`,
      [nombre, email, password]
    );
    return result.insertId;
  }

  async findByEmail(email) {
    const [[user]] = await db.query(
      `SELECT * FROM usuarios WHERE email = ? AND estado = 1`,
      [email]
    );
    return user;
  }

  async findById(id) {
    const [[user]] = await db.query(
      `SELECT id_usuario, nombre, email, estado
       FROM usuarios WHERE id_usuario = ?`,
      [id]
    );
    return user;
  }

  async update(id, data) {
    await db.query(
      `UPDATE usuarios SET nombre = ?, email = ?
       WHERE id_usuario = ?`,
      [data.nombre, data.email, id]
    );
  }

  async disable(id) {
    await db.query(
      `UPDATE usuarios SET estado = 0 WHERE id_usuario = ?`,
      [id]
    );
  }
}

module.exports = UsuarioRepository;
