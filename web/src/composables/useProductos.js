import { ref } from 'vue'
import { productosService } from '../service/productosService'
import { categoriasService } from '../service/categoriasService'
import { movimientosService } from '../service/movimientosService'

const SKU_REGEX = /^SKU-(\d+)$/i

const mapProductoDb = (item) => ({
  id_producto: item.id_producto,
  codigo_sku: item.codigo_sku ?? '',
  nombre: item.nombre ?? '',
  descripcion: item.descripcion ?? '',
  precio_compra: Number(item.precio_compra ?? 0),
  precio_venta: Number(item.precio_venta ?? 0),
  stock_actual: Number(item.stock_actual ?? 0),
  stock_minimo: Number(item.stock_minimo ?? 0),
  id_categoria: item.id_categoria,
  id_proveedor: item.id_proveedor
})

export const useProductos = () => {
  const productos = ref([])
  const categorias = ref([])
  const cargando = ref(false)
  const error = ref('')

  const cargarDatosIniciales = async () => {
    cargando.value = true
    error.value = ''

    try {
      const [resProductos, resCategorias] = await Promise.all([
        productosService.obtenerTodos(),
        categoriasService.obtenerTodas()
      ])

      if (resProductos.success) {
        productos.value = (resProductos.data || []).map(mapProductoDb)
      } else {
        error.value = resProductos.error || 'Error al cargar productos'
      }

      if (resCategorias.success) {
        categorias.value = resCategorias.data || []
      } else if (!error.value) {
        error.value = resCategorias.error || 'Error al cargar categorias'
      }
    } catch (err) {
      error.value = err.message || 'Error desconocido'
    } finally {
      cargando.value = false
    }
  }

  const generateNextSku = () => {
    const maxSkuNumber = productos.value.reduce((max, item) => {
      const sku = String(item.codigo_sku || '').trim().toUpperCase()
      const match = sku.match(SKU_REGEX)
      if (!match) return max
      const value = Number(match[1])
      return Number.isNaN(value) ? max : Math.max(max, value)
    }, 0)

    const next = String(maxSkuNumber + 1).padStart(3, '0')
    return `SKU-${next}`
  }

  const findSkuConflict = (sku, excludeId = null) => {
    const normalized = String(sku || '').trim().toUpperCase()
    return productos.value.find(item => {
      if (excludeId && item.id_producto === excludeId) return false
      return String(item.codigo_sku || '').trim().toUpperCase() === normalized
    })
  }

  const sanitizeProductoInput = (producto, excludeId = null) => {
    const nombre = String(producto.nombre || '').trim()
    const idCategoria = Number(producto.id_categoria)
    const precioCompra = Number(producto.precio_compra || 0)
    const precioVenta = Number(producto.precio_venta || 0)
    const stockActual = Number(producto.stock_actual || 0)
    const stockMinimo = Number(producto.stock_minimo || 0)
    const skuRaw = String(producto.codigo_sku || '').trim().toUpperCase()

    if (!nombre) {
      return { success: false, error: 'Ingresa el nombre del producto.' }
    }

    if (!idCategoria || Number.isNaN(idCategoria)) {
      return { success: false, error: 'Selecciona una categoria valida.' }
    }

    if ([precioCompra, precioVenta, stockActual, stockMinimo].some(Number.isNaN)) {
      return { success: false, error: 'Revisa los campos numericos: solo se aceptan numeros.' }
    }

    if (precioCompra < 0 || precioVenta < 0) {
      return { success: false, error: 'Los precios no pueden ser negativos.' }
    }

    if (stockActual <= 0 || stockMinimo <= 0) {
      return { success: false, error: 'El stock actual y el stock minimo deben ser mayores a 0.' }
    }

    if (!Number.isInteger(stockActual) || !Number.isInteger(stockMinimo)) {
      return { success: false, error: 'El stock debe ingresarse en numeros enteros.' }
    }

    let finalSku = skuRaw
    let generatedSku = false

    if (!finalSku) {
      finalSku = generateNextSku()
      generatedSku = true
    }

    if (!SKU_REGEX.test(finalSku)) {
      return { success: false, error: 'El SKU debe tener formato SKU-001.' }
    }

    const conflict = findSkuConflict(finalSku, excludeId)
    if (conflict) {
      return { success: false, error: `El codigo ${finalSku} ya existe. Usa otro SKU.` }
    }

    return {
      success: true,
      payload: {
        codigo_sku: finalSku,
        nombre,
        descripcion: null,
        precio_compra: precioCompra,
        precio_venta: precioVenta,
        stock_actual: stockActual,
        stock_minimo: stockMinimo,
        id_categoria: idCategoria,
        id_proveedor: null
      },
      generatedSku,
      sku: finalSku
    }
  }

  const crearProducto = async (producto) => {
    try {
      const normalized = sanitizeProductoInput(producto)
      if (!normalized.success) {
        return { success: false, error: normalized.error }
      }

      const resultado = await productosService.crear(normalized.payload)

      if (resultado.success) {
        const nuevo = mapProductoDb(resultado.data)
        productos.value.push(nuevo)
        return {
          success: true,
          data: nuevo,
          generatedSku: normalized.generatedSku,
          sku: normalized.sku
        }
      }

      return { success: false, error: resultado.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const actualizarProducto = async (id, actualizaciones) => {
    try {
      const normalized = sanitizeProductoInput(actualizaciones, id)
      if (!normalized.success) {
        return { success: false, error: normalized.error }
      }

      const resultado = await productosService.actualizar(id, normalized.payload)

      if (resultado.success) {
        const actualizado = mapProductoDb(resultado.data)
        const index = productos.value.findIndex(p => p.id_producto === id)
        if (index !== -1) {
          productos.value[index] = actualizado
        }

        return { success: true, data: actualizado }
      }

      return { success: false, error: resultado.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const eliminarProducto = async (id) => {
    try {
      const resultado = await productosService.eliminar(id)

      if (resultado.success) {
        productos.value = productos.value.filter(p => p.id_producto !== id)
        return { success: true }
      }

      return { success: false, error: resultado.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const registrarMovimientoStock = async ({ producto, tipo, cantidad }) => {
    try {
      const qty = Number(cantidad)
      if (!qty || qty <= 0) {
        return { success: false, error: 'Ingresa una cantidad mayor a 0.' }
      }

      if (!Number.isInteger(qty)) {
        return { success: false, error: 'La cantidad debe ser un numero entero.' }
      }

      const stockActual = Number(producto.stock_actual || 0)
      const nuevoStock = tipo === 'entrada' ? stockActual + qty : stockActual - qty

      if (nuevoStock < 0) {
        return { success: false, error: `Stock insuficiente. Maximo disponible para salida: ${stockActual}.` }
      }

      const resStock = await productosService.actualizarStock(producto.id_producto, nuevoStock)
      if (!resStock.success) {
        return { success: false, error: resStock.error || 'No se pudo actualizar stock' }
      }

      const resMov = await movimientosService.crear({
        id_producto: producto.id_producto,
        tipo_movimiento: tipo,
        cantidad: qty,
        motivo: 'ajuste manual'
      })

      const index = productos.value.findIndex(p => p.id_producto === producto.id_producto)
      if (index !== -1) {
        productos.value[index].stock_actual = nuevoStock
      }

      if (!resMov.success) {
        return { success: true, warning: 'Stock actualizado, pero no se registro en historial' }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    productos,
    categorias,
    cargando,
    error,
    cargarDatosIniciales,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    registrarMovimientoStock
  }
}