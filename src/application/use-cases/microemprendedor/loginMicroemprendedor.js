const jwt = require('jsonwebtoken');
const repo = require('../../../infrastructure/persistence/models/repositories/MicroemprendedorRepository');

module.exports = async (email, password) => {
  const micro = await repo.login(email, password);

  if (!micro) return null;

  const token = jwt.sign(
    {
      id: micro.id_microemprendedor,
      email: micro.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '8h' }
  );

  return {
    ...micro,
    token
  };
};
