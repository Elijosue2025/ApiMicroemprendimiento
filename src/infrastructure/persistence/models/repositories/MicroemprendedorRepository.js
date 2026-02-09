const { pool } = require('../../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async listar() {
    const [rows] = await pool.query(
      'SELECT id_microemprendedor, nombre, email, telefono, direccion, estado FROM microemprendedores'
    );
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT id_microemprendedor, nombre, email, telefono, direccion, estado FROM microemprendedores WHERE id_microemprendedor = ?',
      [id]
    );
    return rows[0];
  },

  async crear(micro) {
    const [result] = await pool.execute(
      `INSERT INTO microemprendedores 
     (nombre, descripcion, telefono, email, password, direccion, estado) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        micro.nombre,
        micro.descripcion || null,
        micro.telefono || null,
        micro.email,
        micro.password,           // ya hasheado desde CrearMicroemprendedor.js
        micro.direccion || null,
        micro.estado ?? 1
      ]
    );

    // Devolvemos sin password (seguridad)
    return {
      id_microemprendedor: result.insertId,
      nombre: micro.nombre,
      descripcion: micro.descripcion,
      telefono: micro.telefono,
      email: micro.email,
      direccion: micro.direccion,
      estado: micro.estado ?? 1
    };
  },




  async actualizar(id, data) {
    const { nombre, descripcion, telefono, direccion, estado } = data;

    await pool.query(
      `UPDATE microemprendedores 
       SET nombre=?, descripcion=?, telefono=?, direccion=?, estado=?
       WHERE id_microemprendedor=?`,
      [nombre, descripcion, telefono, direccion, estado, id]
    );
  },

  async eliminar(id) {
    await pool.query(
      'DELETE FROM microemprendedores WHERE id_microemprendedor = ?',
      [id]
    );
  },

  // 🔐 LOGIN (solo valida credenciales)
  async login(email, password) {
    const [rows] = await pool.query(
      'SELECT * FROM microemprendedores WHERE email = ? AND estado = 1',
      [email]
    );

    if (!rows.length) return null;

    const micro = rows[0];
    const ok = await bcrypt.compare(password, micro.password);

    if (!ok) return null;

    delete micro.password;
    return micro;
  }


};
