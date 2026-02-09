class Microemprendedor {
  constructor({
    id_microemprendedor,
    nombre,
    descripcion,
    telefono,
    email,
    direccion,
    password,
    estado,
    fecha_registro
  }) {
    this.id_microemprendedor = id_microemprendedor;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.telefono = telefono;
    this.email = email;
    this.direccion = direccion;
    this.password = password;
    this.estado = estado;
    this.fecha_registro = fecha_registro;
  }
}

module.exports = Microemprendedor;
