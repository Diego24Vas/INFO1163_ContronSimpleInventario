import { ref } from 'vue'
import { categoriasService } from '../service/categoriasService'

export const useCategorias = () => {
  const categorias = ref([])
  const cargando = ref(false)
  const error = ref('')
  
  // Paginación
  const paginaActual = ref(0)
  const totalPaginas = ref(0)
  const totalRegistros = ref(0)
  const tamanoPagina = 100

  const cargarCategorias = async () => {
    cargando.value = true
    error.value = ''

    try {
      const resultado = await categoriasService.obtenerConPaginacion(0, tamanoPagina)

      if (resultado.success) {
        categorias.value = resultado.data
        paginaActual.value = resultado.paginaActual
        totalPaginas.value = resultado.totalPaginas
        totalRegistros.value = resultado.totalRegistros
      } else {
        error.value = resultado.error || 'Error al cargar categorias'
      }
    } catch (err) {
      error.value = err.message || 'Error desconocido'
    } finally {
      cargando.value = false
    }
  }

  const cargarPagina = async (numeroPagina) => {
    cargando.value = true
    error.value = ''

    try {
      const resultado = await categoriasService.obtenerConPaginacion(numeroPagina, tamanoPagina)

      if (resultado.success) {
        categorias.value = resultado.data
        paginaActual.value = resultado.paginaActual
        totalPaginas.value = resultado.totalPaginas
        totalRegistros.value = resultado.totalRegistros
      } else {
        error.value = resultado.error || 'Error al cargar categorias'
      }
    } catch (err) {
      error.value = err.message || 'Error desconocido'
    } finally {
      cargando.value = false
    }
  }

  const irPaginaSiguiente = async () => {
    if (paginaActual.value < totalPaginas.value - 1) {
      await cargarPagina(paginaActual.value + 1)
    }
  }

  const irPaginaAnterior = async () => {
    if (paginaActual.value > 0) {
      await cargarPagina(paginaActual.value - 1)
    }
  }

  const irPagina = async (numeroPagina) => {
    if (numeroPagina >= 0 && numeroPagina < totalPaginas.value) {
      await cargarPagina(numeroPagina)
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
    paginaActual,
    totalPaginas,
    totalRegistros,
    tamanoPagina,
    cargarCategorias,
    cargarPagina,
    irPaginaSiguiente,
    irPaginaAnterior,
    irPagina,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
  }
}