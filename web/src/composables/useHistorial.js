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
        error.value = resProductos.error || 'No se pudo cargar el catalogo de productos.'
      }

      productos.value = resProductos.success ? (resProductos.data || []) : []

      const productosMap = new Map(
        productos.value.map((producto) => [producto.id_producto, producto.nombre])
      )

      movimientos.value = resMovimientos.success
        ? (resMovimientos.data || []).map((item) => formatMovimiento(item, productosMap))
        : []
    } catch (err) {
      error.value = err.message || 'Error desconocido al cargar historial.'
    } finally {
      cargando.value = false
    }
  }

  return {
    movimientos,
    productos,
    cargando,
    error,
    cargarHistorial
  }
}