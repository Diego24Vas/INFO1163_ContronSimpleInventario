import { ref } from 'vue';
import { proveedoresService } from '../service/proveedoresService';

export const useProveedores = () => {
  const proveedores = ref([]);
  const cargando = ref(false);
  const error = ref('');

  const cargarProveedores = async () => {
    cargando.value = true;
    error.value = '';

    try {
      const resultado = await proveedoresService.obtenerTodos();

      if (resultado.success) {
        proveedores.value = resultado.data;
      } else {
        error.value = resultado.error || 'Error al cargar proveedores';
      }
    } catch (err) {
      error.value = err.message || 'Error desconocido';
    } finally {
      cargando.value = false;
    }
  };

  const crearProveedor = async (proveedor) => {
    try {
      const resultado = await proveedoresService.crear(proveedor);

      if (resultado.success) {
        proveedores.value.push(resultado.data);
        return { success: true, data: resultado.data };
      } else {
        return { success: false, error: resultado.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const actualizarProveedor = async (id, actualizaciones) => {
    try {
      const resultado = await proveedoresService.actualizar(id, actualizaciones);

      if (resultado.success) {
        const index = proveedores.value.findIndex(p => p.id_proveedor === id);
        if (index !== -1) {
          proveedores.value[index] = resultado.data;
        }
        return { success: true, data: resultado.data };
      } else {
        return { success: false, error: resultado.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const eliminarProveedor = async (id) => {
    try {
      const resultado = await proveedoresService.eliminar(id);

      if (resultado.success) {
        proveedores.value = proveedores.value.filter(p => p.id_proveedor !== id);
        return { success: true };
      } else {
        return { success: false, error: resultado.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    proveedores,
    cargando,
    error,
    cargarProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
  };
};
