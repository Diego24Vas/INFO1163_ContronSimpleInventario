import supabase from '../config/supabase';

const TABLE_NAME = 'movimientos';

export const movimientosService = {
  // CREATE - Crear un nuevo movimiento
  async crear(movimiento) {
    try {
      // Obtener el máximo ID actual para generar el siguiente
      const { data: datosExistentes, error: errorConsulta } = await supabase
        .from(TABLE_NAME)
        .select('id_movimiento')
        .order('id_movimiento', { ascending: false })
        .limit(1);
      
      if (errorConsulta) throw errorConsulta;
      
      // Calcular el próximo ID
      const proximoId = (datosExistentes && datosExistentes.length > 0) 
        ? datosExistentes[0].id_movimiento + 1 
        : 1;

      // Agregar el ID calculado al objeto movimiento
      const movimientoConId = {
        id_movimiento: proximoId,
        ...movimiento
      };

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([movimientoConId])
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

  // READ - Obtener movimientos con paginación
  async obtenerConPaginacion(pagina = 0, tamanoPagina = 100) {
    try {
      const desde = pagina * tamanoPagina;
      const hasta = desde + tamanoPagina - 1;
      
      // Obtener los datos paginados CON count incluido
      const { data, count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .order('fecha_hora', { ascending: false })
        .limit(tamanoPagina)
        .range(desde, hasta);
      
      if (error) throw error;
      
      const totalCount = count || (data ? data.length : 0);
      
      return { 
        success: true, 
        data: data || [],
        paginaActual: pagina,
        tamanoPagina,
        totalRegistros: totalCount,
        totalPaginas: Math.ceil(totalCount / tamanoPagina)
      };
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
