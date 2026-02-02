const MicroemprendedorRepository = require('../../../infrastructure/persistence/models/repositories/MicroemprendedorRepository');

module.exports = async () => {
  return await MicroemprendedorRepository.listar();
};
