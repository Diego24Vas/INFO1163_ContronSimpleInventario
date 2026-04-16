import { ref } from 'vue'
import { categoriasService } from '../service/categoriasService'

export const useCategorias = () => {
  const categorias = ref([])
  const cargando = ref(false)
  const error = ref('')

  const cargarCategorias = async () => {
    cargando.value = true
    error.value = ''

    try {
      const resultado = await categoriasService.obtenerTodas()

      if (resultado.success) {
        categorias.value = resultado.data
      } else {
        error.value = resultado.error || 'Error al cargar categorias'
      }
    } catch (err) {
      error.value = err.message || 'Error desconocido'
    } finally {
      cargando.value = false
    }
  }

  const crearCategoria = async (categoria) => {
    try {
      const resultado = await categoriasService.crear(categoria)

      if (resultado.success) {
        categorias.value.push(resultado.data)
        return { success: true, data: resultado.data }
      }

      return { success: false, error: resultado.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const actualizarCategoria = async (id, actualizaciones) => {
    try {
      const resultado = await categoriasService.actualizar(id, actualizaciones)

      if (resultado.success) {
        const index = categorias.value.findIndex(categoria => categoria.id_categoria === id)
        if (index !== -1) {
          categorias.value[index] = resultado.data
        }

        return { success: true, data: resultado.data }
      }

      return { success: false, error: resultado.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const eliminarCategoria = async (id) => {
    try {
      const resultado = await categoriasService.eliminar(id)

      if (resultado.success) {
        categorias.value = categorias.value.filter(categoria => categoria.id_categoria !== id)
        return { success: true }
      }

      return { success: false, error: resultado.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    categorias,
    cargando,
    error,
    cargarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
  }
}