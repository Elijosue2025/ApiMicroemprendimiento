const jwt = require('jsonwebtoken');

const {
  listarMicroemprendedores,
  obtenerMicroemprendedor,
  actualizarMicroemprendedor,
  eliminarMicroemprendedor,
  loginMicroemprendedor
} = require('../../application/use-cases/microemprendedor');

const crearUseCase = require('../../application/use-cases/microemprendedor/CrearMicroemprendedor');
const repo = require('../../infrastructure/persistence/models/repositories/MicroemprendedorRepository');

module.exports = {
  // 📄 LISTAR
  listar: async (req, res) => {
    try {
      res.json(await listarMicroemprendedores());
    } catch (e) {
      res.status(500).json({ message: 'Error al listar microemprendedores' });
    }
  },

  // 🔍 OBTENER
  obtener: async (req, res) => {
    try {
      res.json(await obtenerMicroemprendedor(req.params.id));
    } catch (e) {
      res.status(404).json({ message: 'Microemprendedor no encontrado' });
    }
  },

  // ➕ CREAR (🔥 ESTE ES EL IMPORTANTE)
  async crear(req, res) {
  try {
    const micro = await crearUseCase(req.body, repo);

    return res.status(201).json({
      message: 'Microemprendedor creado correctamente',
      data: micro
    });

  } catch (error) {
    console.error(error);

    if (error.message === 'PASSWORD_REQUIRED') {
      return res.status(400).json({
        message: 'El password es obligatorio'
      });
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'El email ya está registrado'
      });
    }

    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
}
,


  // ✏️ ACTUALIZAR
  actualizar: async (req, res) => {
    try {
      await actualizarMicroemprendedor(req.params.id, req.body);
      res.json({ message: 'Microemprendedor actualizado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al actualizar' });
    }
  },

  // 🗑 ELIMINAR
  eliminar: async (req, res) => {
    try {
      await eliminarMicroemprendedor(req.params.id);
      res.sendStatus(204);
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar' });
    }
  },

  // 🔐 LOGIN CON JWT
  // Versión mejorada (más segura y limpia)
login: async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  try {
    const micro = await loginMicroemprendedor(email, password.trim());

    if (!micro) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Nunca devuelvas la contraseña ni datos sensibles
    const { password: _, ...microSinPassword } = micro;

    const token = jwt.sign(
      {
        id: micro.id_microemprendedor,
        email: micro.email,           // opcional, pero útil
        role: 'microemprendedor'
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }             // o '1d', '7d', etc.
    );

    return res.json({
      message: 'Login exitoso',
      token,
      microemprendedor: microSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno en el login' });
  }
},
};

