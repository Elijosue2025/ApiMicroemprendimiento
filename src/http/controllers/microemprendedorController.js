const {
  listarMicroemprendedores,
  obtenerMicroemprendedor,
  crearMicroemprendedor,
  actualizarMicroemprendedor,
  eliminarMicroemprendedor
} = require('../../application/use-cases/microemprendedor');

module.exports = {
  listar: async (req, res) => {
    res.json(await listarMicroemprendedores());
  },

  obtener: async (req, res) => {
    res.json(await obtenerMicroemprendedor(req.params.id));
  },

  crear: async (req, res) => {
    res.status(201).json(await crearMicroemprendedor(req.body));
  },

  actualizar: async (req, res) => {
    res.json(await actualizarMicroemprendedor(req.params.id, req.body));
  },

  eliminar: async (req, res) => {
    await eliminarMicroemprendedor(req.params.id);
    res.sendStatus(204);
  }
};
