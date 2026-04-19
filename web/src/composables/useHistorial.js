import { ref, computed } from 'vue'
import { movimientosService } from '../service/movimientosService'
import { productosService } from '../service/productosService'

const formatMovimiento = (movimiento, productosMap) => ({
  id_movimiento: movimiento.id_movimiento,
  id_producto: movimiento.id_producto,
  nombre_producto: productosMap.get(movimiento.id_producto) || `Producto #${movimiento.id_producto}`,
  tipo_movimiento: movimiento.tipo_movimiento || 'entrada',
  cantidad: Number(movimiento.cantidad || 0),
  fecha_hora: movimiento.fecha_hora,
  motivo: movimiento.motivo || '-'
})

export const useHistorial = () => {
  const movimientosCompletos = ref([])
  const productos = ref([])
  const cargando = ref(false)
  const error = ref('')
  
  // Paginación
  const paginaActual = ref(0)
  const totalPaginas = ref(0)
  const totalRegistros = ref(0)
  const tamanoPagina = 100

  const cargarHistorial = async () => {
    cargando.value = true
    error.value = ''

    try {
      const [resMovimientos, resProductos] = await Promise.all([
        movimientosService.obtenerTodos(),
        productosService.obtenerTodos()
      ])

      if (!resMovimientos.success) {
        error.value = resMovimientos.error || 'No se pudo cargar el historial.'
      }

      if (!resProductos.success && !error.value) {
        error.value = resProductos.error || 'No se pudo cargar el catálogo de productos.'
      }

      productos.value = resProductos.success ? (resProductos.data || []) : []

      const productosMap = new Map(
        productos.value.map((producto) => [producto.id_producto, producto.nombre])
      )

      movimientosCompletos.value = resMovimientos.success
        ? (resMovimientos.data || []).map((item) => formatMovimiento(item, productosMap))
        : []
      
      paginaActual.value = 0
      totalRegistros.value = movimientosCompletos.value.length
      totalPaginas.value = Math.ceil(totalRegistros.value / tamanoPagina)
    } catch (err) {
      error.value = err.message || 'Error desconocido al cargar historial.'
    } finally {
      cargando.value = false
    }
  }

  const cargarPagina = async (numeroPagina) => {
    if (numeroPagina >= 0 && numeroPagina < totalPaginas.value) {
      paginaActual.value = numeroPagina
    }
  }

  // Funciones de paginación
  const irPaginaSiguiente = async () => {
    if (paginaActual.value < totalPaginas.value - 1) {
      paginaActual.value++
    }
  }

  const irPaginaAnterior = async () => {
    if (paginaActual.value > 0) {
      paginaActual.value--
    }
  }

  const irPagina = async (numeroPagina) => {
    if (numeroPagina >= 0 && numeroPagina < totalPaginas.value) {
      paginaActual.value = numeroPagina
    }
  }

  // Computed para movimientos paginados
  const movimientos = computed(() => {
    const inicio = paginaActual.value * tamanoPagina
    const fin = inicio + tamanoPagina
    return movimientosCompletos.value.slice(inicio, fin)
  })

  return {
    movimientosCompletos,
    movimientos,
    productos,
    cargando,
    error,
    paginaActual,
    totalPaginas,
    totalRegistros,
    tamanoPagina,
    cargarHistorial,
    cargarPagina,
    irPaginaSiguiente,
    irPaginaAnterior,
    irPagina
  }
}