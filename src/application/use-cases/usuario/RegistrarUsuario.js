class RegistrarUsuario {
  constructor(usuarioRepository, hashService) {
    this.usuarioRepository = usuarioRepository;
    this.hashService = hashService;
  }

  async execute(data) {
    data.password = await this.hashService.hash(data.password);
    return this.usuarioRepository.create(data);
  }
}

module.exports = RegistrarUsuario;
