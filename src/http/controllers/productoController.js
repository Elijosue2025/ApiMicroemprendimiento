const ProductoRepository = require(
  '../../infrastructure/persistence/models/repositories/ProductoRepository'
);
const ObtenerDetalleProducto = require(
  '../../application/use-cases/producto/ObtenerDetalleProducto'
);
const repo = new ProductoRepository();
const obtenerDetalleUseCase = new ObtenerDetalleProducto(repo);  // ← instancia única

module.exports = {

  // 📄 TODOS LOS PRODUCTOS
  listarTodos: async (req, res) => {
    try {
      const productos = await repo.listarTodos();
      res.json(productos);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error al listar productos' });
    }
  },


  // 📄 POR MICROEMPRENDEDOR
  listarPorMicro: async (req, res) => {
    try {
      const productos = await repo.listarPorMicroemprendedor(req.params.id);
      res.json(productos);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error al listar productos' });
    }
  },

  // 🔍 UNO
  obtener: async (req, res) => {
    try {
      const producto = await repo.obtenerPorId(req.params.id);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(producto);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error al obtener producto' });
    }
  },

  // ➕ CREAR
  crear: async (req, res) => {
    try {
      const producto = await repo.crear(req.body);
      res.status(201).json(producto);
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e.message });
    }
  },

  // ✏️ ACTUALIZAR
  actualizar: async (req, res) => {
    try {
      const producto = await repo.actualizar(req.params.id, req.body);
      res.json(producto);
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e.message });
    }
  },
  obtenerDetalle: async (req, res) => {
    try {
      const detalle = await obtenerDetalleUseCase.execute(req.params.id);
      return res.json(detalle);
    } catch (error) {
      console.error('Error al obtener detalle del producto:', error);

      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.status(500).json({
        message: 'Error interno al obtener detalle del producto',
        error: error.message
      });
    }
  },
  // 🗑 ELIMINAR
  eliminar: async (req, res) => {
    try {
      await repo.darDeBaja(req.params.id);
      res.sendStatus(204);
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e.message });
    }
  }
};
