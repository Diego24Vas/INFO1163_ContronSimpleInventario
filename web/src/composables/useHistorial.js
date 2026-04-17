import { ref } from 'vue'
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
  const movimientos = ref([])
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
        movimientosService.obtenerConPaginacion(paginaActual.value, tamanoPagina),
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

      movimientos.value = resMovimientos.success
        ? (resMovimientos.data || []).map((item) => formatMovimiento(item, productosMap))
        : []
      
      paginaActual.value = resMovimientos.paginaActual
      totalPaginas.value = resMovimientos.totalPaginas
      totalRegistros.value = resMovimientos.totalRegistros
    } catch (err) {
      error.value = err.message || 'Error desconocido al cargar historial.'
    } finally {
      cargando.value = false
    }
  }

  const cargarPagina = async (numeroPagina) => {
    cargando.value = true
    error.value = ''

    try {
      const resMovimientos = await movimientosService.obtenerConPaginacion(numeroPagina, tamanoPagina)

      if (!resMovimientos.success) {
        error.value = resMovimientos.error || 'No se pudo cargar el historial.'
      }

      const productosMap = new Map(
        productos.value.map((producto) => [producto.id_producto, producto.nombre])
      )

      movimientos.value = resMovimientos.success
        ? (resMovimientos.data || []).map((item) => formatMovimiento(item, productosMap))
        : []
      
      paginaActual.value = resMovimientos.paginaActual
      totalPaginas.value = resMovimientos.totalPaginas
      totalRegistros.value = resMovimientos.totalRegistros
    } catch (err) {
      error.value = err.message || 'Error desconocido al cargar historial.'
    } finally {
      cargando.value = false
    }
  }

  // Eliminar funciones relacionadas con la paginación
  const irPaginaSiguiente = async () => {}
  const irPaginaAnterior = async () => {}
  const irPagina = async () => {}

  return {
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