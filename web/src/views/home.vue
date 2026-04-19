<template>
  <div class="home">
    <Toast />
    <div class="container">
      <div class="buscador-wrapper">
        <buscador @search="handleSearch" />
      </div>
      
      <button @click="mostrarFiltros = !mostrarFiltros" class="btn-filtros-toggle">
        <span class="toggle-icon" :class="{ abierto: mostrarFiltros }">⊕</span>
        <span class="toggle-text">{{ mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros' }}</span>
      </button>
      
      <div v-show="mostrarFiltros" class="filtros-wrapper" :class="{ expandido: mostrarFiltros }">
        <div class="filtros-grupo">
          <div class="filtros-label">Categorías:</div>
          <div class="filtros-botones">
            <button 
              v-for="categoria in categorias" 
              :key="categoria.id_categoria"
              @click="categoriaSeleccionada = categoriaSeleccionada === categoria.id_categoria ? null : categoria.id_categoria"
              :class="['filtro-btn', { activo: categoriaSeleccionada === categoria.id_categoria }]"
            >
              {{ categoria.nombre }}
            </button>
          </div>
        </div>
        
        <div class="filtros-grupo">
          <div class="filtros-label">Proveedores:</div>
          <div class="filtros-botones">
            <button 
              v-for="proveedor in proveedores" 
              :key="proveedor.id_proveedor"
              @click="proveedorSeleccionado = proveedorSeleccionado === proveedor.id_proveedor ? null : proveedor.id_proveedor"
              :class="['filtro-btn', { activo: proveedorSeleccionado === proveedor.id_proveedor }]"
            >
              {{ proveedor.nombre_empresa }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="tabla-wrapper">
        <div v-if="cargando" class="cargando">Cargando productos...</div>
        <div v-else-if="productos.length === 0" class="empty-state">
          <p>No hay productos en stock</p>
        </div>
        <div v-else class="tabla-container">
          <table class="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th @click="alternarOrdenStock" class="th-ordenable">
                  Stock
                  <span v-if="ordenStock === 'asc'" class="orden-icon">▲</span>
                  <span v-else-if="ordenStock === 'desc'" class="orden-icon">▼</span>
                  <span v-else class="orden-icon-neutral">⇅</span>
                </th>
                <th @click="alternarOrdenPrecio" class="th-ordenable">
                  Precio
                  <span v-if="ordenPrecio === 'asc'" class="orden-icon">▲</span>
                  <span v-else-if="ordenPrecio === 'desc'" class="orden-icon">▼</span>
                  <span v-else class="orden-icon-neutral">⇅</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productos" :key="producto.id_producto" :class="['fila', { 'stock-bajo': producto.stock_actual < producto.stock_minimo }]">
                <td>{{ producto.nombre }}</td>
                <td class="sku">{{ producto.codigo_sku }}</td>
                <td>{{ obtenerNombreCategoria(producto.id_categoria) }}</td>
                <td class="stock-cell">
                  <div class="stock-content">
                    <button @click="abrirModalAgregar(producto)" class="btn-accion btn-agregar" title="Agregar">+</button>
                    <span class="stock" v-if="producto.stock_actual === 0">Sin stock</span>
                    <span class="stock" v-else>{{ producto.stock_actual }}</span>
                    <button @click="abrirModalEliminar(producto)" class="btn-accion btn-eliminar" title="Eliminar" :disabled="producto.stock_actual === 0">−</button>
                  </div>
                </td>
                <td class="precio">${{ producto.precio_compra }}</td>
              </tr>
            </tbody>
          </table>
          <Paginador
            v-if="totalRegistros > 100"
            :pagina-actual="paginaActual"
            :total-paginas="totalPaginas"
            :total-registros="totalRegistros"
            :tamanio-pagina="tamanoPagina"
            @anterior="irPaginaAnterior"
            @siguiente="irPaginaSiguiente"
            @ir-pagina="irPagina"
          />
        </div>
      </div>
    </div>

    <!-- Modal para agregar stock -->
    <div v-if="mostrarModalAgregar" class="modal-overlay" @click.self="cerrarModales">
      <div class="modal-contenido">
        <h3>Agregar Stock</h3>
        <p class="producto-nombre">{{ productoActual?.nombre }}</p>
        <div class="modal-body">
          <label>Cantidad a agregar:</label>
          <input 
            v-model.number="cantidadModal" 
            type="number" 
            min="1" 
            placeholder="0"
            @keyup.enter="confirmarAgregar"
          />
          <p class="stock-info">Stock actual: {{ productoActual?.stock_actual }} → {{ (productoActual?.stock_actual || 0) + (cantidadModal || 0) }}</p>
          
          <label>Motivo (opcional):</label>
          <input 
            v-model="motivoModal" 
            type="text" 
            placeholder="Ej: Compra a proveedor"
            @keyup.enter="confirmarAgregar"
          />
        </div>
        <div class="modal-acciones">
          <button @click="confirmarAgregar" class="btn btn-guardar" :disabled="actualizando || cantidadModal <= 0">
            {{ actualizando ? 'Guardando...' : 'Agregar' }}
          </button>
          <button @click="cerrarModales" class="btn btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para eliminar stock -->
    <div v-if="mostrarModalEliminar" class="modal-overlay" @click.self="cerrarModales">
      <div class="modal-contenido">
        <h3>Reducir Stock</h3>
        <p class="producto-nombre">{{ productoActual?.nombre }}</p>
        <div class="modal-body">
          <label>Cantidad a eliminar:</label>
          <input 
            v-model.number="cantidadModal" 
            type="number" 
            min="1" 
            :max="productoActual?.stock_actual"
            placeholder="0"
            @keyup.enter="confirmarEliminar"
          />
          <p class="stock-info">Stock actual: {{ productoActual?.stock_actual }} → {{ Math.max(0, (productoActual?.stock_actual || 0) - (cantidadModal || 0)) }}</p>
          
          <label>Motivo (opcional):</label>
          <input 
            v-model="motivoModal" 
            type="text" 
            placeholder="Ej: Venta, revisión de stock"
            @keyup.enter="confirmarEliminar"
          />
        </div>
        <div class="modal-acciones">
          <button @click="confirmarEliminar" class="btn btn-eliminar-confirm" :disabled="actualizando || cantidadModal <= 0">
            {{ actualizando ? 'Guardando...' : 'Eliminar' }}
          </button>
          <button @click="cerrarModales" class="btn btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import buscador from '../components/buscador.vue'
import Paginador from '../components/Paginador.vue'
import Toast from 'primevue/toast'
import { productosService } from '../service/productosService'
import { categoriasService } from '../service/categoriasService'
import { proveedoresService } from '../service/proveedoresService'

const toast = useToast()

const productosCompletos = ref([])
const categorias = ref([])
const proveedores = ref([])
const cargando = ref(true)
const actualizando = ref(false)
const busqueda = ref('')
const categoriaSeleccionada = ref(null)
const proveedorSeleccionado = ref(null)
const mostrarFiltros = ref(false)
const mostrarModalAgregar = ref(false)
const mostrarModalEliminar = ref(false)
const productoActual = ref(null)
const cantidadModal = ref(0)
const motivoModal = ref('')
const ordenStock = ref(null) // null, 'asc', 'desc'
const ordenPrecio = ref(null) // null, 'asc', 'desc'

// Paginación
const paginaActual = ref(0)
const totalPaginas = ref(0)
const totalRegistros = ref(0)
const tamanoPagina = 100

// Watchers para resetear página cuando cambian los filtros
watch(categoriaSeleccionada, () => {
  paginaActual.value = 0
})

watch(proveedorSeleccionado, () => {
  paginaActual.value = 0
})

// Computed para productos filtrados (todos, sin paginación)
const productosFiltrados = computed(() => {
  let resultado = productosCompletos.value
  
  // Filtrar por búsqueda
  if (busqueda.value.trim()) {
    const query = busqueda.value.toLowerCase()
    resultado = resultado.filter(producto => 
      producto.nombre.toLowerCase().includes(query) ||
      producto.codigo_sku.toLowerCase().includes(query)
    )
  }
  
  // Filtrar por categoría
  if (categoriaSeleccionada.value) {
    resultado = resultado.filter(producto => 
      producto.id_categoria === categoriaSeleccionada.value
    )
  }
  
  // Filtrar por proveedor
  if (proveedorSeleccionado.value) {
    resultado = resultado.filter(producto => 
      producto.id_proveedor === proveedorSeleccionado.value
    )
  }
  
  // Ordenar por stock si hay un orden activo
  if (ordenStock.value === 'asc') {
    resultado = [...resultado].sort((a, b) => a.stock_actual - b.stock_actual)
  } else if (ordenStock.value === 'desc') {
    resultado = [...resultado].sort((a, b) => b.stock_actual - a.stock_actual)
  }
  // Ordenar por precio si hay un orden activo
  else if (ordenPrecio.value === 'asc') {
    resultado = [...resultado].sort((a, b) => a.precio_compra - b.precio_compra)
  } else if (ordenPrecio.value === 'desc') {
    resultado = [...resultado].sort((a, b) => b.precio_compra - a.precio_compra)
  }
  
  return resultado
})

// Computed para productos paginados (aplicar paginación local)
const productos = computed(() => {
  const inicio = paginaActual.value * tamanoPagina
  const fin = inicio + tamanoPagina
  
  // Actualizar totales basado en productos filtrados
  totalRegistros.value = productosFiltrados.value.length
  totalPaginas.value = Math.ceil(productosFiltrados.value.length / tamanoPagina)
  
  return productosFiltrados.value.slice(inicio, fin)
})

const actualizarPaginacion = () => {
  paginaActual.value = 0
}

const handleSearch = (query) => {
  busqueda.value = query
  paginaActual.value = 0
}

const alternarOrdenStock = () => {
  if (ordenStock.value === null) {
    ordenStock.value = 'desc'
  } else if (ordenStock.value === 'desc') {
    ordenStock.value = 'asc'
  } else {
    ordenStock.value = null
  }
  paginaActual.value = 0
}

const alternarOrdenPrecio = () => {
  if (ordenPrecio.value === null) {
    ordenPrecio.value = 'desc'
  } else if (ordenPrecio.value === 'desc') {
    ordenPrecio.value = 'asc'
  } else {
    ordenPrecio.value = null
  }
  paginaActual.value = 0
}

const obtenerNombreCategoria = (idCategoria) => {
  const categoria = categorias.value.find(cat => cat.id_categoria === idCategoria)
  return categoria?.nombre || '-'
}

const cargarProductos = async () => {
  cargando.value = true
  try {
    const resultado = await productosService.obtenerTodos()
    
    if (resultado.success) {
      productosCompletos.value = resultado.data || []
      paginaActual.value = 0
      actualizarPaginacion()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los productos',
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los productos',
      life: 3000
    })
  }
  cargando.value = false
}

const cargarPagina = async (numeroPagina) => {
  if (numeroPagina >= 0 && numeroPagina < totalPaginas.value) {
    paginaActual.value = numeroPagina
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

const cargarCategorias = async () => {
  const resultado = await categoriasService.obtenerTodas()
  
  if (resultado.success) {
    categorias.value = resultado.data || []
  }
}

const cargarProveedores = async () => {
  const resultado = await proveedoresService.obtenerTodos()
  
  if (resultado.success) {
    proveedores.value = resultado.data || []
  }
}

const abrirModalAgregar = (producto) => {
  productoActual.value = producto
  cantidadModal.value = 0
  mostrarModalAgregar.value = true
}

const abrirModalEliminar = (producto) => {
  productoActual.value = producto
  cantidadModal.value = 0
  mostrarModalEliminar.value = true
}

const cerrarModales = () => {
  mostrarModalAgregar.value = false
  mostrarModalEliminar.value = false
  productoActual.value = null
  cantidadModal.value = 0
  motivoModal.value = ''
}

const confirmarAgregar = async () => {
  if (!productoActual.value || cantidadModal.value <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Cantidad inválida',
      detail: 'Por favor ingresa una cantidad mayor a 0',
      life: 3000
    })
    return
  }
  
  actualizando.value = true
  const resultado = await productosService.agregarStock(
    productoActual.value.id_producto, 
    cantidadModal.value,
    motivoModal.value || 'Ingreso desde home'
  )
  
  if (resultado.success) {
    await cargarProductos()
    cerrarModales()
    toast.add({
      severity: 'success',
      summary: 'Stock agregado',
      detail: 'Se agregó stock. El movimiento fue registrado en el historial.',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: resultado.error || 'No se pudo agregar el stock',
      life: 4000
    })
  }
  actualizando.value = false
}

const confirmarEliminar = async () => {
  if (!productoActual.value || cantidadModal.value <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Cantidad inválida',
      detail: 'Por favor ingresa una cantidad mayor a 0',
      life: 3000
    })
    return
  }
  
  // Validar que la cantidad no supere el stock actual
  if (cantidadModal.value > productoActual.value.stock_actual) {
    toast.add({
      severity: 'error',
      summary: 'Stock insuficiente',
      detail: `No puedes eliminar más de ${productoActual.value.stock_actual} unidades. Stock actual: ${productoActual.value.stock_actual}`,
      life: 4000
    })
    return
  }
  
  actualizando.value = true
  const resultado = await productosService.reducirStock(
    productoActual.value.id_producto, 
    cantidadModal.value,
    motivoModal.value || 'Salida desde home'
  )
  
  if (resultado.success) {
    await cargarProductos()
    cerrarModales()
    toast.add({
      severity: 'success',
      summary: 'Stock reducido',
      detail: 'Se retiraron productos. El movimiento fue registrado en el historial.',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: resultado.error || 'No se pudo reducir el stock',
      life: 4000
    })
  }
  actualizando.value = false
}

onMounted(() => {
  cargarCategorias()
  cargarProveedores()
  cargarProductos()
})
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--spacing-xl);
  background: var(--bg-primary);
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.buscador-wrapper {
  display: flex;
  justify-content: center;
}

.btn-filtros-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  align-self: flex-start;
  margin-left: auto;
}

.btn-filtros-toggle:hover {
  background-color: #1d4ed8;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.toggle-icon {
  font-size: 1rem;
  transition: transform var(--transition-fast);
  display: inline-block;
}

.toggle-icon.abierto {
  transform: rotate(45deg);
}

.filtros-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  animation: slideDown var(--transition-base) ease-out;
  max-height: 500px;
  overflow: hidden;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    padding: 0 var(--spacing-md);
  }
  to {
    opacity: 1;
    max-height: 500px;
    padding: var(--spacing-md);
  }
}

.filtros-grupo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filtros-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filtros-botones {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filtro-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filtro-btn:hover {
  background-color: rgba(37, 99, 235, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.filtro-btn.activo {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.cargando {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
}

.tabla-wrapper {
  width: 100%;
}

.tabla-container {
  overflow-x: auto;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
}

.tabla thead {
  background: var(--bg-tertiary);
  border-bottom: 2px solid var(--border-light);
}

.tabla th {
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla thead tr th:nth-child(4) {
  text-align: center;
}

.th-ordenable {
  cursor: pointer;
  user-select: none;
  transition: background-color var(--transition-fast);
}

.th-ordenable:hover {
  background-color: rgba(37, 99, 235, 0.1);
}

.orden-icon {
  margin-left: var(--spacing-xs);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: bold;
}

.orden-icon-neutral {
  margin-left: var(--spacing-xs);
  color: var(--text-muted);
  font-size: 0.75rem;
  opacity: 0.5;
}

.tabla td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.tabla .fila:hover {
  background-color: var(--bg-tertiary);
}

.tabla .fila.stock-bajo {
  background-color: rgba(239, 68, 68, 0.15);
}

.tabla .fila.stock-bajo:hover {
  background-color: rgba(239, 68, 68, 0.25);
}

.tabla .sku {
  color: var(--primary);
  font-weight: 500;
  font-size: 0.85rem;
  font-family: monospace;
}

.stock-cell {
  padding: 0 !important;
}

.stock-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  gap: var(--spacing-sm);
}

.stock {
  font-weight: 500;
  color: var(--success);
  flex: 1;
  text-align: center;
}

.btn-accion {
  background: none;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color var(--transition-fast);
  opacity: 0;
  transition: opacity var(--transition-fast), background-color var(--transition-fast);
}

.tabla .fila:hover .btn-accion {
  opacity: 1;
}

.btn-agregar {
  color: var(--success);
}

.btn-agregar:hover {
  background-color: rgba(16, 185, 129, 0.1);
}

.btn-eliminar {
  color: var(--error);
}

.btn-eliminar:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.1);
}

.btn-eliminar:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  color: var(--text-muted);
}

.tabla .precio {
  color: var(--primary);
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-contenido h3 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.producto-nombre {
  color: var(--primary);
  font-weight: 500;
  margin-bottom: var(--spacing-md);
}

.modal-body {
  margin: var(--spacing-lg) 0;
}

.modal-body label {
  display: block;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-size: 0.9rem;
}

.modal-body input {
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
}

.modal-body input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.stock-info {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: var(--spacing-sm);
}

.modal-acciones {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.btn {
  flex: 1;
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-guardar {
  background-color: var(--success);
  color: white;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #059669;
}

.btn-eliminar-confirm {
  background-color: var(--error);
  color: white;
}

.btn-eliminar-confirm:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-cancelar {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}

.btn-cancelar:hover:not(:disabled) {
  background-color: var(--border-light);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Estilos para componentes PrimeVue */
:deep(.p-inputgroup) {
  background-color: white;
  border-radius: var(--radius-md);
  border: 1px solid #d0d0d0;
  overflow: hidden;
}

:deep(.p-inputtext) {
  background-color: white;
  color: black;
  border: none;
  padding: var(--spacing-md);
}

:deep(.p-inputtext::placeholder) {
  color: var(--text-muted);
}

:deep(.p-inputtext:focus) {
  box-shadow: none;
}

:deep(.p-button) {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: var(--spacing-md);
}

:deep(.p-button:hover) {
  background-color: #1d4ed8;
}
</style>
