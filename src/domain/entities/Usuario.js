// Muy simple – solo estructura + posible validación futura
class Usuario {
  constructor(data) {
    this.id_usuario     = data.id_usuario;
    this.nombre         = data.nombre;
    this.email          = data.email;
    this.password       = data.password;        // solo se usa internamente
    this.estado         = data.estado ?? 1;
    this.fecha_registro = data.fecha_registro;
  }
}

module.exports = Usuario;