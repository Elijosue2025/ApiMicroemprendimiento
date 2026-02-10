class Usuario {
  constructor({ id_usuario, nombre, email, password, estado }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.estado = estado;
  }
}

module.exports = Usuario;
