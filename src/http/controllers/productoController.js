const ProductoRepository = require('../../infrastructure/persistence/models/repositories/ProductoRepository');
const ObtenerDetalleProducto = require('../../application/use-cases/producto/ObtenerDetalleProducto');
const { pool } = require('../../infrastructure/config/database');

const repo = new ProductoRepository();
const obtenerDetalleUseCase = new ObtenerDetalleProducto(repo);

const useCases = require('../../application/use-cases/producto');

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

  // 📄 POR CATEGORÍA
  listarPorCategoria: async (req, res) => {
    try {
      const id_categoria = parseInt(req.params.id_categoria);
      if (isNaN(id_categoria)) {
        return res.status(400).json({ message: 'ID de categoría inválido' });
      }
      const productos = await useCases.ListarProductosPorCategoria(id_categoria, repo);
      res.json(productos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener productos por categoría' });
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

  // 🔍 UNO (simple)
  obtener: async (req, res) => {
    try {
      const producto = await repo.obtenerPorId(req.params.id);
      if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(producto);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error al obtener producto' });
    }
  },

  // ➕ CREAR SIMPLE - SOLO PARA PRUEBAS (sin imágenes)
  crearPruebas: async (req, res) => {
    try {
      const producto = await repo.crear(req.body);
      res.status(201).json({
        message: 'Producto creado (modo pruebas - sin imágenes)',
        producto
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e.message });
    }
  },

  // ➕ CREAR COMPLETO - PRODUCCIÓN (con imágenes y token)
crear: async (req, res) => {
  try {
    console.log('Usuario autenticado:', req.user); // ← ya lo tienes, confirma id: 7

    // ID del microemprendedor viene del token (el campo se llama "id")
    const id_microemprendedor = req.user.id;

    if (!id_microemprendedor) {
      return res.status(401).json({ message: 'No se pudo obtener ID del microemprendedor desde el token' });
    }

    console.log('ID microemprendedor extraído:', id_microemprendedor); // ← log clave

    // Datos del formulario
    const data = {
      id_microemprendedor,
      id_categoria: req.body.id_categoria,
      nombre: req.body.nombre ? req.body.nombre.trim() : null,
      descripcion: req.body.descripcion ? req.body.descripcion.trim() : null,
      precio: req.body.precio ? parseFloat(req.body.precio) : null,
      stock: req.body.stock ? parseInt(req.body.stock) : 100,
      destacado: req.body.destacado === '1' || req.body.destacado === true ? 1 : 0
    };

    console.log('Datos a insertar:', data); // ← log para ver qué se envía a DB

    // Validaciones
    if (!data.id_categoria || !data.nombre || !data.precio || data.precio <= 0) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o precio inválido' });
    }

    // Crear producto
    const producto = await repo.crear(data);

    // Guardar imágenes si se subieron
    let imagenesGuardadas = [];
    if (req.files && req.files.length > 0) {
      const imagenes = req.files.map(file => ({
        id_producto: producto.id_producto,
        url_imagen: `/img/${file.filename}`
      }));

      await pool.query(
        'INSERT INTO producto_imagenes (id_producto, url_imagen) VALUES ?',
        [imagenes.map(img => [img.id_producto, img.url_imagen])]
      );

      imagenesGuardadas = imagenes.map(img => img.url_imagen);
    }

    // Devolver detalle completo
    const detalle = await obtenerDetalleUseCase.execute(producto.id_producto);

    res.status(201).json({
      ...detalle,
      mensaje: 'Producto creado exitosamente',
      imagenes: imagenesGuardadas
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ message: error.message || 'Error al crear el producto' });
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

  // 🔍 DETALLE COMPLETO
  obtenerDetalle: async (req, res) => {
    try {
      const detalle = await obtenerDetalleUseCase.execute(req.params.id);
      res.json(detalle);
    } catch (error) {
      console.error(error);
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(500).json({ message: 'Error al obtener detalle' });
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