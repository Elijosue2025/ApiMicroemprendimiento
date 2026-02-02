const MicroemprendedorRepository = require('../../../infrastructure/persistence/models/repositories/MicroemprendedorRepository');

module.exports = async (id, data) => {
  return await MicroemprendedorRepository.actualizar(id, data);
};
