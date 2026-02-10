class CrearComentario {
  constructor(comentarioRepository) {
    this.comentarioRepository = comentarioRepository;
  }

  async execute({ id_usuario, id_producto, comentario, calificacion }) {
    return this.comentarioRepository.create({
      id_usuario,
      id_producto,
      comentario,
      calificacion
    });
  }
}

module.exports = CrearComentario;
