const CategoriaRepository = require(
  '../../infrastructure/persistence/models/repositories/CategoriaRepository'
);

const {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} = require('../../application/use-cases/categoria');

const repo = new CategoriaRepository();

exports.listar = async (_, res) => {
  const caso = new listarCategorias(repo);
  res.json(await caso.ejecutar());
};

exports.obtener = async (req, res) => {
  const caso = new obtenerCategoria(repo);
  res.json(await caso.ejecutar(req.params.id));
};

exports.crear = async (req, res) => {
  const caso = new crearCategoria(repo);
  res.status(201).json(await caso.ejecutar(req.body));
};

exports.actualizar = async (req, res) => {
  const caso = new actualizarCategoria(repo);
  res.json(await caso.ejecutar(req.params.id, req.body));
};

exports.eliminar = async (req, res) => {
  const caso = new eliminarCategoria(repo);
  res.json(await caso.ejecutar(req.params.id));
};
