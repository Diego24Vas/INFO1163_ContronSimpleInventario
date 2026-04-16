<template>
  <div class="productos-view">
    <Toast />
    <h1>Gestion de Productos</h1>

    <div class="buscador-wrapper">
      <buscador @search="handleSearch" placeholder="Buscar por nombre o SKU" />
    </div>

    <div class="contenido">
      <div class="formulario-section">
        <FormularioProducto
          ref="formProductoRef"
          :producto-id="productoEdicion?.id_producto"
          :producto-data="productoEdicion"
          :categorias="categorias"
          :cargando="cargando"
          @guardar="guardarProducto"
          @cerrar="cerrarFormulario"
        />
      </div>

      <div class="estadisticas-section">
        <EstadisticasProductos :productos="productosFiltrados" />
      </div>
    </div>

    <div class="listado-section">
      <h2>Listado de Productos</h2>
      <div v-if="cargando" class="loading">Cargando...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <ListadoProductos
        v-else
        :productos="productosFiltrados"
        :categorias="categorias"
        @editar="editarProducto"
        @eliminar="eliminarProducto"
        @movimiento="abrirMovimiento"
      />
    </div>

    <div v-if="mostrarModalMovimiento" class="modal-overlay" @click.self="cerrarMovimiento">
      <div class="modal-contenido">
        <h3>{{ tipoMovimiento === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida' }}</h3>
        <p class="producto-nombre">{{ productoMovimiento?.nombre }}</p>
        <div class="modal-body">
          <label>Cantidad</label>
          <input v-model.number="cantidadMovimiento" type="number" min="1" />
          <small class="ayuda-cantidad" v-if="tipoMovimiento === 'salida'">
            Disponible para salida: {{ productoMovimiento?.stock_actual ?? 0 }} unidades.
          </small>
          <small class="ayuda-cantidad" v-else>
            Ingresa unidades enteras y mayores a 0.
          </small>
        </div>
        <p v-if="mensajeMovimiento" class="mensaje-movimiento">{{ mensajeMovimiento }}</p>
        <div class="modal-acciones">
          <button class="btn btn-primary" @click="confirmarMovimiento">Confirmar</button>
          <button class="btn btn-secondary" @click="cerrarMovimiento">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import buscador from '../components/buscador.vue'
import FormularioProducto from '../components/FormularioProducto.vue'
import ListadoProductos from '../components/ListadoProductos.vue'
import EstadisticasProductos from '../components/EstadisticasProductos.vue'
import { useProductos } from '../composables/useProductos'

const toast = useToast()

const {
  productos,
  categorias,
  cargando,
  error,
  cargarDatosIniciales,
  crearProducto,
  actualizarProducto,
  eliminarProducto: eliminarProductoService,
  registrarMovimientoStock
} = useProductos()

const busqueda = ref('')
const productoEdicion = ref(null)
const formProductoRef = ref(null)

const mostrarModalMovimiento = ref(false)
const productoMovimiento = ref(null)
const tipoMovimiento = ref('entrada')
const cantidadMovimiento = ref(1)
const mensajeMovimiento = ref('')

const productosFiltrados = computed(() => {
  if (!busqueda.value.trim()) {
    return productos.value
  }

  const query = busqueda.value.toLowerCase()
  return productos.value.filter((producto) => {
    const nombre = String(producto.nombre || '').toLowerCase()
    const sku = String(producto.codigo_sku || '').toLowerCase()
    return nombre.includes(query) || sku.includes(query)
  })
})

onMounted(() => {
  cargarDatosIniciales()
})

const handleSearch = (texto) => {
  busqueda.value = texto
}

const guardarProducto = async (datos) => {
  let resultado

  if (productoEdicion.value) {
    resultado = await actualizarProducto(productoEdicion.value.id_producto, datos)
  } else {
    resultado = await crearProducto(datos)
  }

  if (resultado.success) {
    if (resultado.generatedSku && resultado.sku) {
      toast.add({
        severity: 'info',
        summary: 'SKU autogenerado',
        detail: `Se asigno automaticamente el codigo ${resultado.sku}.`,
        life: 3500
      })
    }

    toast.add({
      severity: 'success',
      summary: productoEdicion.value ? 'Producto actualizado' : 'Producto creado',
      detail: 'La informacion del producto se guardo correctamente.',
      life: 3000
    })
    cerrarFormulario()
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Revisa los datos',
      detail: resultado.error || 'No se pudo guardar el producto.',
      life: 4000
    })
  }
}

const editarProducto = (producto) => {
  productoEdicion.value = producto
}

const eliminarProducto = async (idProducto) => {
  const resultado = await eliminarProductoService(idProducto)
  if (resultado.success) {
    toast.add({
      severity: 'success',
      summary: 'Producto eliminado',
      detail: 'El producto se elimino correctamente.',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: resultado.error || 'No se pudo eliminar el producto.',
      life: 3500
    })
  }
}

const cerrarFormulario = () => {
  formProductoRef.value?.resetForm()
  productoEdicion.value = null
}

const abrirMovimiento = ({ producto, tipo }) => {
  productoMovimiento.value = producto
  tipoMovimiento.value = tipo
  cantidadMovimiento.value = 1
  mensajeMovimiento.value = ''
  mostrarModalMovimiento.value = true
}

const cerrarMovimiento = () => {
  mostrarModalMovimiento.value = false
  productoMovimiento.value = null
  cantidadMovimiento.value = 1
  mensajeMovimiento.value = ''
}

const confirmarMovimiento = async () => {
  if (!productoMovimiento.value) {
    return
  }

  if (!Number.isInteger(Number(cantidadMovimiento.value)) || Number(cantidadMovimiento.value) <= 0) {
    mensajeMovimiento.value = 'Ingresa una cantidad entera mayor a 0.'
    return
  }

  const resultado = await registrarMovimientoStock({
    producto: productoMovimiento.value,
    tipo: tipoMovimiento.value,
    cantidad: cantidadMovimiento.value
  })

  if (!resultado.success) {
    mensajeMovimiento.value = resultado.error || 'No se pudo registrar el movimiento'
    toast.add({
      severity: 'warn',
      summary: 'Movimiento no aplicado',
      detail: mensajeMovimiento.value,
      life: 3500
    })
    return
  }

  if (resultado.warning) {
    mensajeMovimiento.value = resultado.warning
    toast.add({
      severity: 'warn',
      summary: 'Movimiento parcial',
      detail: resultado.warning,
      life: 3500
    })
  } else {
    toast.add({
      severity: 'success',
      summary: 'Movimiento registrado',
      detail: `Se aplico una ${tipoMovimiento.value} de ${cantidadMovimiento.value} unidad(es).`,
      life: 3000
    })
    cerrarMovimiento()
  }
}
</script>

<style scoped>
.productos-view {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.productos-view h1 {
  margin-bottom: var(--spacing-xl);
}

.buscador-wrapper {
  margin-bottom: var(--spacing-lg);
}

.contenido {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: var(--spacing-xl);
  align-items: start;
  margin-bottom: var(--spacing-2xl);
}

.formulario-section {
  position: sticky;
  top: var(--spacing-xl);
}

.listado-section h2 {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--primary);
  font-size: 1.3rem;
}

.loading {
  text-align: center;
  color: var(--text-muted);
  padding: var(--spacing-2xl);
}

.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--error);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-contenido {
  width: min(420px, calc(100vw - 2rem));
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
}

.modal-contenido h3 {
  margin: 0 0 var(--spacing-sm);
  color: var(--primary);
}

.producto-nombre {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.modal-body input {
  padding: var(--spacing-sm) var(--spacing-md);
}

.ayuda-cantidad {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.mensaje-movimiento {
  margin-top: var(--spacing-sm);
  color: var(--warning);
  font-size: 0.9rem;
}

.modal-acciones {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.btn {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .contenido {
    grid-template-columns: 1fr;
  }

  .formulario-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .productos-view {
    padding: var(--spacing-lg);
  }
}
</style>
