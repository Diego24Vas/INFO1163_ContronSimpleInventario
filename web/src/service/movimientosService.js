import supabase from '../config/supabase';

const TABLE_NAME = 'movimientos';

export const movimientosService = {
  // CREATE - Crear un nuevo movimiento
  async crear(movimiento) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([movimiento])
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener todos los movimientos
  async obtenerTodos() {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('fecha_hora', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener un movimiento por ID
  async obtenerPorId(id) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id_movimiento', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener movimientos por producto
  async obtenerPorProducto(idProducto) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id_producto', idProducto)
        .order('fecha_hora', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener movimientos por tipo
  async obtenerPorTipo(tipo) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('tipo_movimiento', tipo)
        .order('fecha_hora', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener movimientos entre fechas
  async obtenerEntreFechas(fechaInicio, fechaFin) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .gte('fecha_hora', fechaInicio)
        .lte('fecha_hora', fechaFin)
        .order('fecha_hora', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Actualizar un movimiento
  async actualizar(id, actualizaciones) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(actualizaciones)
        .eq('id_movimiento', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // DELETE - Eliminar un movimiento
  async eliminar(id) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id_movimiento', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
