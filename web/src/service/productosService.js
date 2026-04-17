import supabase from '../config/supabase';
import { movimientosService } from './movimientosService';

const TABLE_NAME = 'productos';

export const productosService = {
  // CREATE - Crear un nuevo producto
  async crear(producto) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([producto])
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener todos los productos
  async obtenerTodos() {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener un producto por ID
  async obtenerPorId(id) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id_producto', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener productos por categoría
  async obtenerPorCategoria(idCategoria) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id_categoria', idCategoria);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener productos por proveedor
  async obtenerPorProveedor(idProveedor) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id_proveedor', idProveedor);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Actualizar un producto
  async actualizar(id, actualizaciones) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(actualizaciones)
        .eq('id_producto', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // DELETE - Eliminar un producto
  async eliminar(id) {
    try {
      // Primero, obtener todos los movimientos del producto
      const movimientosResult = await movimientosService.obtenerPorProducto(id);
      
      // Eliminar todos los movimientos asociados
      if (movimientosResult.success && movimientosResult.data && movimientosResult.data.length > 0) {
        for (const movimiento of movimientosResult.data) {
          const deleteResult = await movimientosService.eliminar(movimiento.id_movimiento);
          if (!deleteResult.success) {
            throw new Error(`No se pudo eliminar el movimiento ${movimiento.id_movimiento}: ${deleteResult.error}`);
          }
        }
      }
      
      // Luego eliminar el producto
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id_producto', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Actualizar stock
  async actualizarStock(id, cantidad) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({ stock_actual: cantidad })
        .eq('id_producto', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Agregar stock y registrar movimiento
  async agregarStock(id, cantidad, motivo = 'Ingreso desde home') {
    try {
      // Primero, traer el stock actual
      const productoActual = await this.obtenerPorId(id);
      if (!productoActual.success) {
        throw new Error('No se pudo obtener el producto');
      }

      const nuevoStock = productoActual.data.stock_actual + cantidad;

      // Actualizar el stock
      const { data: productoActualizado, error: errorStock } = await supabase
        .from(TABLE_NAME)
        .update({ stock_actual: nuevoStock })
        .eq('id_producto', id)
        .select();
      
      if (errorStock) throw errorStock;

      // Registrar el movimiento
      const movimiento = {
        id_producto: id,
        tipo_movimiento: 'entrada',
        cantidad: cantidad,
        fecha_hora: new Date().toISOString(),
        motivo: motivo || 'Ingreso desde home'
      };

      const resultadoMovimiento = await movimientosService.crear(movimiento);
      if (!resultadoMovimiento.success) {
        console.error('Error al crear movimiento:', resultadoMovimiento.error);
        throw new Error('No se pudo registrar el movimiento: ' + resultadoMovimiento.error);
      }

      return { success: true, data: productoActualizado[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Reducir stock y registrar movimiento
  async reducirStock(id, cantidad, motivo = 'Salida desde home') {
    try {
      // Primero, traer el stock actual
      const productoActual = await this.obtenerPorId(id);
      if (!productoActual.success) {
        throw new Error('No se pudo obtener el producto');
      }

      const nuevoStock = Math.max(0, productoActual.data.stock_actual - cantidad);

      // Actualizar el stock
      const { data: productoActualizado, error: errorStock } = await supabase
        .from(TABLE_NAME)
        .update({ stock_actual: nuevoStock })
        .eq('id_producto', id)
        .select();
      
      if (errorStock) throw errorStock;

      // Registrar el movimiento
      const movimiento = {
        id_producto: id,
        tipo_movimiento: 'salida',
        cantidad: cantidad,
        fecha_hora: new Date().toISOString(),
        motivo: motivo || 'Salida desde home'
      };

      const resultadoMovimiento = await movimientosService.crear(movimiento);
      if (!resultadoMovimiento.success) {
        console.error('Error al crear movimiento:', resultadoMovimiento.error);
        throw new Error('No se pudo registrar el movimiento: ' + resultadoMovimiento.error);
      }

      return { success: true, data: productoActualizado[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
