const MicroemprendedorRepository = require('../../../infrastructure/persistence/models/repositories/MicroemprendedorRepository');

module.exports = async (data) => {
  return await MicroemprendedorRepository.crear(data);
};
