const jwt = require('jsonwebtoken');

module.exports = async function LoginUsuario(email, password, repo) {
  const user = await repo.login(email, password);

  if (!user) {
    return null;
  }

  const token = jwt.sign(
    {
      id: user.id_usuario,
      email: user.email,
      role: 'usuario'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '8h' }
  );

  return { user, token };
};