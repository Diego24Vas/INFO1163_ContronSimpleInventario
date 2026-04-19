import supabase from '../config/supabase';

const TABLE_NAME = 'categorias';

export const categoriasService = {
  // CREATE - Crear una nueva categoría
  async crear(categoria) {
    try {
      // Asegurarse de que no se envíe un id_categoria
      const categoriaSinId = { ...categoria };
      delete categoriaSinId.id_categoria;

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([categoriaSinId])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // READ - Obtener todas las categorías (cargando iterativamente para evitar límite de 1000)
  async obtenerTodas() {
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

  // READ - Obtener categorías con paginación
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

      if (error) {
        // Detectar error de clave foránea
        if (error.message.includes('foreign key')) {
          throw new Error('No se puede eliminar la categoría porque tiene datos vinculados.');
        }
        throw error;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
