const { pool } = require('../../config/database');

class UsuarioRepository {

  async crear(usuario) {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, email, password)
       VALUES (?, ?, ?)`,
      [usuario.nombre, usuario.email, usuario.password]
    );
    return { id_usuario: result.insertId, ...usuario };
  }

  async obtenerPorEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }
}

module.exports = UsuarioRepository;
