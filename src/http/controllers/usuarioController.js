const UsuarioRepository = require('../../infrastructure/persistence/models/repositories/UsuarioRepository');
const useCases = require('../../application/use-cases/usuario');

const repo = new UsuarioRepository();

const crearUseCase         = useCases.CrearUsuario;
const loginUseCase         = useCases.LoginUsuario;
const obtenerPerfilUseCase = useCases.ObtenerPerfilUsuario;
const actualizarUseCase    = useCases.ActualizarUsuario;
const desactivarUseCase    = useCases.DesactivarUsuario;

module.exports = {
  registrar: async (req, res) => {
    try {
      const nuevo = await crearUseCase(req.body, repo);
      res.status(201).json({
        message: 'Usuario registrado correctamente',
        usuario: nuevo
      });
    } catch (err) {
      if (err.message === 'EMAIL_REQUERIDO') return res.status(400).json({ message: 'Email obligatorio' });
      if (err.message === 'PASSWORD_INVALIDO') return res.status(400).json({ message: 'Contraseña inválida (mínimo 6 caracteres)' });
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email ya registrado' });
      console.error(err);
      res.status(500).json({ message: 'Error al registrar' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña requeridos' });

    try {
      const result = await loginUseCase(email.trim(), password.trim(), repo);
      if (!result) return res.status(401).json({ message: 'Credenciales inválidas' });

      res.json({
        message: 'Login exitoso',
        token: result.token,
        usuario: result.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en login' });
    }
  },

  perfil: async (req, res) => {
    try {
      const usuario = await obtenerPerfilUseCase(req.user.id, repo);
      res.json(usuario);
    } catch (err) {
      if (err.message === 'USUARIO_NO_ENCONTRADO') return res.status(404).json({ message: 'Perfil no encontrado' });
      res.status(500).json({ message: 'Error al obtener perfil' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const actualizado = await actualizarUseCase(req.user.id, req.body, repo);
      res.json({
        message: 'Perfil actualizado',
        usuario: actualizado
      });
    } catch (err) {
      res.status(400).json({ message: 'Error al actualizar' });
    }
  },

  desactivar: async (req, res) => {
    try {
      await desactivarUseCase(req.user.id, repo);
      res.json({ message: 'Cuenta desactivada correctamente' });
    } catch (err) {
      res.status(500).json({ message: 'Error al desactivar cuenta' });
    }
  }
};