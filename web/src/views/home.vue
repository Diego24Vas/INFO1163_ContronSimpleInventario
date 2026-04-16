<template>
  <div class="home">
    <div class="container">
      <div class="buscador-wrapper">
        <buscador @search="handleSearch" />
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
                    <span class="stock">{{ producto.stock_actual }}</span>
                    <button @click="abrirModalEliminar(producto)" class="btn-accion btn-eliminar" title="Eliminar">−</button>
                  </div>
                </td>
                <td class="precio">${{ producto.precio_compra }}</td>
              </tr>
            </tbody>
          </table>
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
        </div>
        <div class="modal-acciones">
          <button @click="confirmarAgregar" class="btn btn-guardar" :disabled="actualizando">
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
        </div>
        <div class="modal-acciones">
          <button @click="confirmarEliminar" class="btn btn-eliminar-confirm" :disabled="actualizando">
            {{ actualizando ? 'Guardando...' : 'Eliminar' }}
          </button>
          <button @click="cerrarModales" class="btn btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import buscador from '../components/buscador.vue'
import { productosService } from '../service/productosService'
import { categoriasService } from '../service/categoriasService'

const productosCompletos = ref([])
const categorias = ref([])
const cargando = ref(true)
const actualizando = ref(false)
const busqueda = ref('')
const mostrarModalAgregar = ref(false)
const mostrarModalEliminar = ref(false)
const productoActual = ref(null)
const cantidadModal = ref(0)
const ordenStock = ref(null) // null, 'asc', 'desc'
const ordenPrecio = ref(null) // null, 'asc', 'desc'

const productos = computed(() => {
  let resultado = productosCompletos.value
  
  // Filtrar por búsqueda
  if (busqueda.value.trim()) {
    const query = busqueda.value.toLowerCase()
    resultado = resultado.filter(producto => 
      producto.nombre.toLowerCase().includes(query) ||
      producto.codigo_sku.toLowerCase().includes(query)
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

const handleSearch = (query) => {
  busqueda.value = query
}

const alternarOrdenStock = () => {
  if (ordenStock.value === null) {
    ordenStock.value = 'desc'
  } else if (ordenStock.value === 'desc') {
    ordenStock.value = 'asc'
  } else {
    ordenStock.value = null
  }
}

const alternarOrdenPrecio = () => {
  if (ordenPrecio.value === null) {
    ordenPrecio.value = 'desc'
  } else if (ordenPrecio.value === 'desc') {
    ordenPrecio.value = 'asc'
  } else {
    ordenPrecio.value = null
  }
}

const obtenerNombreCategoria = (idCategoria) => {
  const categoria = categorias.value.find(cat => cat.id_categoria === idCategoria)
  return categoria?.nombre || '-'
}

const cargarProductos = async () => {
  cargando.value = true
  const resultado = await productosService.obtenerTodos()
  
  if (resultado.success) {
    productosCompletos.value = resultado.data || []
  }
  
  cargando.value = false
}

const cargarCategorias = async () => {
  const resultado = await categoriasService.obtenerTodas()
  
  if (resultado.success) {
    categorias.value = resultado.data || []
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
}

const confirmarAgregar = async () => {
  if (cantidadModal.value <= 0 || !productoActual.value) return
  
  actualizando.value = true
  const nuevoStock = productoActual.value.stock_actual + cantidadModal.value
  const resultado = await productosService.actualizarStock(productoActual.value.id_producto, nuevoStock)
  
  if (resultado.success) {
    await cargarProductos()
    cerrarModales()
  }
  actualizando.value = false
}

const confirmarEliminar = async () => {
  if (cantidadModal.value <= 0 || !productoActual.value) return
  
  actualizando.value = true
  const nuevoStock = Math.max(0, productoActual.value.stock_actual - cantidadModal.value)
  const resultado = await productosService.actualizarStock(productoActual.value.id_producto, nuevoStock)
  
  if (resultado.success) {
    await cargarProductos()
    cerrarModales()
  }
  actualizando.value = false
}

onMounted(() => {
  cargarCategorias()
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

.btn-eliminar:hover {
  background-color: rgba(239, 68, 68, 0.1);
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

.tabla td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.tabla .fila:hover {
  background-color: var(--bg-tertiary);
}

.tabla .sku {
  color: var(--primary);
  font-weight: 500;
  font-size: 0.85rem;
  font-family: monospace;
}

.tabla .stock {
  font-weight: 500;
  color: var(--success);
}

.tabla .precio {
  color: var(--primary);
  font-weight: 500;
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
