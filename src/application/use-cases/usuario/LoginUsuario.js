class LoginUsuario {
  constructor(usuarioRepository, hashService, jwtService) {
    this.usuarioRepository = usuarioRepository;
    this.hashService = hashService;
    this.jwtService = jwtService;
  }

  async execute(email, password) {
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    const valid = await this.hashService.compare(password, user.password);
    if (!valid) throw new Error('Credenciales inválidas');

    return this.jwtService.sign({ id_usuario: user.id_usuario });
  }
}

module.exports = LoginUsuario;
