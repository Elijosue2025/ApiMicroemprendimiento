const ProductoRepository = require(
  '../../infrastructure/persistence/models/repositories/ProductoRepository'
);

const {
  CrearProducto,
  ListarProductosPorMicroemprendedor,
  ActualizarProducto,
  EliminarProducto
} = require('../../application/use-cases/producto');

const repo = new ProductoRepository();

exports.crear = async (req, res) => {
  try {
    const caso = new CrearProducto(repo);
    res.status(201).json(await caso.ejecutar(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.listarPorMicroemprendedor = async (req, res) => {
  const caso = new ListarProductosPorMicroemprendedor(repo);
  res.json(await caso.ejecutar(req.params.id));
};

exports.actualizar = async (req, res) => {
  try {
    const caso = new ActualizarProducto(repo);
    res.json(
      await caso.ejecutar(req.params.id, req.body.id_microemprendedor, req.body)
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const caso = new EliminarProducto(repo);
    res.json(
      await caso.ejecutar(req.params.id, req.body.id_microemprendedor)
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
