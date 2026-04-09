import supabase from '../config/supabase';

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
  }
};
