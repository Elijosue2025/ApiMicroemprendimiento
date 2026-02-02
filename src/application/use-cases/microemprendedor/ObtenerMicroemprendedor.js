const MicroemprendedorRepository = require('../../../infrastructure/persistence/models/repositories/MicroemprendedorRepository');

module.exports = async (id) => {
  return await MicroemprendedorRepository.obtenerPorId(id);
};
