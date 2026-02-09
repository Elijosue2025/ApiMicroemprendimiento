const bcrypt = require('bcryptjs');
const Microemprendedor = require('../../../domain/entities/Microemprendedor');

module.exports = async (data, repository) => {
  console.log('DATA USE CASE:', data);

  if (!data.password) {
    throw new Error('PASSWORD_REQUIRED');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const micro = new Microemprendedor({
    ...data,
    password: hashedPassword,
    estado: 1
  });

  return await repository.crear(micro);
};
