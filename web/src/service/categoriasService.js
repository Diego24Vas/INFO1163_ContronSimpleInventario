import supabase from '../config/supabase';

const TABLE_NAME = 'categorias';

export const categoriasService = {
  // CREATE - Crear una nueva categoría
  async crear(categoria) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([categoria])
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener todas las categorías
  async obtenerTodas() {
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

  // READ - Obtener una categoría por ID
  async obtenerPorId(id) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id_categoria', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener categoría por nombre
  async obtenerPorNombre(nombre) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('nombre', nombre);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Actualizar una categoría
  async actualizar(id, actualizaciones) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(actualizaciones)
        .eq('id_categoria', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // DELETE - Eliminar una categoría
  async eliminar(id) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id_categoria', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
