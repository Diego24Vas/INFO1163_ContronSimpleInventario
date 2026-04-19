import supabase from '../config/supabase';

const TABLE_NAME = 'proveedores';

export const proveedoresService = {
  // CREATE - Crear un nuevo proveedor
  async crear(proveedor) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([proveedor])
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener todos los proveedores (cargando iterativamente para evitar límite de 1000)
  async obtenerTodos() {
    try {
      let todosDatos = [];
      let pagina = 0;
      const tamanoPagina = 1000;
      let hayMas = true;

      while (hayMas) {
        const desde = pagina * tamanoPagina;
        const hasta = desde + tamanoPagina - 1;
        
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select('*')
          .range(desde, hasta);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          hayMas = false;
        } else {
          todosDatos = todosDatos.concat(data);
          if (data.length < tamanoPagina) {
            hayMas = false;
          } else {
            pagina++;
          }
        }
      }

      return { success: true, data: todosDatos };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener proveedores con paginación
  async obtenerConPaginacion(pagina = 0, tamanoPagina = 100) {
    try {
      const desde = pagina * tamanoPagina;
      const hasta = desde + tamanoPagina - 1;
      
      // Obtener los datos paginados CON count incluido
      const { data, count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
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

  // READ - Obtener un proveedor por ID
  async obtenerPorId(id) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id_proveedor', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener proveedor por nombre
  async obtenerPorNombre(nombre) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('nombre_empresa', nombre);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener proveedores por contacto
  async obtenerPorContacto(nombreContacto) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('nombre_contacto', nombreContacto);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Actualizar un proveedor
  async actualizar(id, actualizaciones) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(actualizaciones)
        .eq('id_proveedor', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // DELETE - Eliminar un proveedor
  async eliminar(id) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id_proveedor', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
