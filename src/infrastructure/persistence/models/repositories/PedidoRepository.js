// src/infrastructure/persistence/models/repositories/PedidoRepository.js
const { pool } = require('../../../config/database');

class PedidoRepository {
  
  // ============================================
  // LISTAR PEDIDOS DEL MICROEMPRENDEDOR
  // ============================================
  async listarPorMicro(id_microemprendedor) {
    console.log('\n=== 🔍 LISTAR PEDIDOS DEL MICRO ===');
    console.log('ID Microemprendedor:', id_microemprendedor);
    
    const query = `
      SELECT DISTINCT
        p.id_pedido,
        p.fecha_pedido,
        p.estado,
        p.total,
        p.notas_cliente,
        u.nombre AS nombre_usuario,
        COUNT(DISTINCT pd.id_detalle) AS cantidad_items
      FROM pedidos p
      INNER JOIN pedido_detalles pd ON p.id_pedido = pd.id_pedido
      INNER JOIN productos pr ON pd.id_producto = pr.id_producto
      LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE pr.id_microemprendedor = ?
      GROUP BY p.id_pedido, p.fecha_pedido, p.estado, p.total, p.notas_cliente, u.nombre
      ORDER BY p.fecha_pedido DESC
    `;
    
    try {
      const [rows] = await pool.query(query, [id_microemprendedor]);
      console.log(`✅ Pedidos encontrados: ${rows.length}`);
      
      if (rows.length > 0) {
        console.log('\n📋 Pedidos:');
        rows.forEach(r => {
          console.log(`  - Pedido #${r.id_pedido} | Estado: ${r.estado} | Total: $${r.total} | Items: ${r.cantidad_items}`);
        });
      }
      
      return rows;
      
    } catch (error) {
      console.error('❌ Error en listarPorMicro:', error);
      throw error;
    }
  }

  // ============================================
  // CREAR PEDIDO
  // ============================================
  async crearPedido(id_usuario, total, notas_cliente = '') {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO pedidos (id_usuario, fecha_pedido, estado, total, notas_cliente)
         VALUES (?, NOW(), 'pendiente', ?, ?)`,
        [id_usuario, total, notas_cliente]
      );

      await connection.commit();
      console.log(`✅ Pedido creado con ID: ${result.insertId}`);
      return result.insertId;
      
    } catch (error) {
      await connection.rollback();
      console.error('❌ Error al crear pedido:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // ============================================
  // CREAR DETALLE
  // ============================================
  async crearDetalle(id_pedido, detalle) {
    try {
      await pool.query(
        `INSERT INTO pedido_detalles (id_pedido, id_producto, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [id_pedido, detalle.id_producto, detalle.cantidad, detalle.precio_unitario]
      );
      console.log(`✅ Detalle agregado al pedido #${id_pedido}`);
    } catch (error) {
      console.error('❌ Error al crear detalle:', error);
      throw error;
    }
  }

  // ============================================
  // LISTAR PEDIDOS DE USUARIO
  // ============================================
  async listarPorUsuario(id_usuario) {
    const query = `
      SELECT 
        p.id_pedido,
        p.fecha_pedido,
        p.estado,
        p.total,
        COUNT(pd.id_detalle) AS cantidad_items,
        u.nombre AS nombre_usuario
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN pedido_detalles pd ON p.id_pedido = pd.id_pedido
      WHERE p.id_usuario = ?
      GROUP BY p.id_pedido
      ORDER BY p.fecha_pedido DESC
    `;
    
    try {
      const [rows] = await pool.query(query, [id_usuario]);
      console.log(`✅ Pedidos del usuario ${id_usuario}: ${rows.length}`);
      return rows;
    } catch (error) {
      console.error('❌ Error en listarPorUsuario:', error);
      throw error;
    }
  }

  // ============================================
  // OBTENER PEDIDO COMPLETO
  // ============================================
  async obtenerPedidoCompleto(id_pedido) {
    console.log(`\n🔍 Obteniendo pedido completo #${id_pedido}`);
    
    const query = `
      SELECT 
        pd.id_detalle,
        pd.id_producto,
        pr.nombre AS nombre_producto,
        pd.cantidad,
        pd.precio_unitario,
        pd.subtotal,
        p.id_pedido,
        p.id_usuario,
        p.fecha_pedido,
        p.estado,
        p.total,
        p.notas_cliente,
        u.nombre AS nombre_usuario,
        u.email AS email_usuario,
        u.telefono AS telefono_usuario,
        pr.id_microemprendedor,
        (SELECT url_imagen 
         FROM producto_imagenes pi 
         WHERE pi.id_producto = pd.id_producto 
         LIMIT 1) AS url_imagen
      FROM pedido_detalles pd
      JOIN pedidos p ON pd.id_pedido = p.id_pedido
      JOIN productos pr ON pd.id_producto = pr.id_producto
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_pedido = ?
    `;
    
    try {
      const [rows] = await pool.query(query, [id_pedido]);
      console.log(`✅ Pedido #${id_pedido} encontrado: ${rows.length} items`);
      return rows;
    } catch (error) {
      console.error('❌ Error en obtenerPedidoCompleto:', error);
      throw error;
    }
  }

  // ============================================
  // CAMBIAR ESTADO
  // ============================================
  async cambiarEstado(id_pedido, nuevoEstado) {
    console.log(`\n🔄 Cambiando estado del pedido #${id_pedido} a: ${nuevoEstado}`);
    
    // Validar estados permitidos
    const estadosPermitidos = ['pendiente', 'aprobado', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error(`Estado no válido: ${nuevoEstado}`);
    }
    
    const [result] = await pool.query(
      `UPDATE pedidos SET estado = ? WHERE id_pedido = ?`,
      [nuevoEstado, id_pedido]
    );
    
    console.log(`✅ Estado actualizado. Filas afectadas: ${result.affectedRows}`);
    return result.affectedRows > 0;
  }

  // ============================================
  // AUMENTAR STOCK (al cancelar pedido)
  // ============================================
  async aumentarStock(id_producto, cantidad) {
    console.log(`\n📈 Aumentando stock del producto #${id_producto} en ${cantidad} unidades`);
    
    await pool.query(
      `UPDATE productos SET stock = stock + ? WHERE id_producto = ?`,
      [cantidad, id_producto]
    );
    
    console.log(`✅ Stock actualizado`);
  }

  // ============================================
  // REDUCIR STOCK (al crear pedido)
  // ============================================
  async reducirStock(id_producto, cantidad) {
    console.log(`\n📉 Reduciendo stock del producto #${id_producto} en ${cantidad} unidades`);
    
    const [result] = await pool.query(
      `UPDATE productos SET stock = stock - ? WHERE id_producto = ? AND stock >= ?`,
      [cantidad, id_producto, cantidad]
    );
    
    if (result.affectedRows === 0) {
      throw new Error(`Stock insuficiente para el producto #${id_producto}`);
    }
    
    console.log(`✅ Stock reducido`);
  }
}

module.exports = PedidoRepository;