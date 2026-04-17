<template>
  <div class="filtros-historial">
    <div class="filtro-item">
      <label>Producto</label>
      <div class="buscador-productos">
        <input
          v-model="busquedaProducto"
          type="text"
          placeholder="Buscar producto..."
          @input="handleBusquedaProducto"
          @blur="cerrarOpciones"
        />
        <div v-if="mostrarOpciones && productosFiltrados.length > 0" class="opciones-dropdown">
          <div class="opcion-item" @click="seleccionarProducto(null)">
            Todos
          </div>
          <div
            v-for="producto in productosFiltrados"
            :key="producto.id_producto"
            class="opcion-item"
            @click="seleccionarProducto(producto)"
          >
            {{ producto.nombre }}
          </div>
        </div>
      </div>
    </div>

    <div class="filtro-item">
      <label>Tipo</label>
      <select v-model="filtros.tipo_movimiento" @change="emitirCambios">
        <option value="">Todos</option>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>
    </div>

    <div class="filtro-item">
      <label>Desde</label>
      <input v-model="filtros.fecha_inicio" type="date" @change="emitirCambios" />
    </div>

    <div class="filtro-item">
      <label>Hasta</label>
      <input v-model="filtros.fecha_fin" type="date" @change="emitirCambios" />
    </div>

    <div class="filtro-item acciones">
      <button class="btn btn-secondary" type="button" @click="limpiar">Limpiar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  productos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cambiar'])

const filtros = ref({
  id_producto: null,
  tipo_movimiento: '',
  fecha_inicio: '',
  fecha_fin: ''
})

const busquedaProducto = ref('')
const mostrarOpciones = ref(false)
const productoSeleccionado = ref(null)

const productosFiltrados = computed(() => {
  if (!busquedaProducto.value) {
    return props.productos
  }
  const busqueda = busquedaProducto.value.toLowerCase()
  return props.productos.filter(p => p.nombre.toLowerCase().includes(busqueda))
})

const handleBusquedaProducto = () => {
  mostrarOpciones.value = busquedaProducto.value.length > 0
}

const seleccionarProducto = (producto) => {
  if (producto) {
    filtros.value.id_producto = producto.id_producto
    busquedaProducto.value = producto.nombre
    productoSeleccionado.value = producto
  } else {
    filtros.value.id_producto = null
    busquedaProducto.value = ''
    productoSeleccionado.value = null
  }
  mostrarOpciones.value = false
  emitirCambios()
}

const cerrarOpciones = () => {
  setTimeout(() => {
    mostrarOpciones.value = false
  }, 150)
}

const emitirCambios = () => {
  emit('cambiar', { ...filtros.value })
}

const limpiar = () => {
  filtros.value = {
    id_producto: null,
    tipo_movimiento: '',
    fecha_inicio: '',
    fecha_fin: ''
  }
  busquedaProducto.value = ''
  productoSeleccionado.value = null
  emitirCambios()
}
</script>

<style scoped>
.filtros-historial {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--spacing-md);
  align-items: end;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.filtro-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filtro-item label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.filtro-item select,
.filtro-item input {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.buscador-productos {
  position: relative;
}

.buscador-productos input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  font-size: 0.9rem;
}

.buscador-productos input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.opciones-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-light);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.opcion-item {
  padding: var(--spacing-md);
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.opcion-item:last-child {
  border-bottom: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.opcion-item:hover {
  background-color: var(--bg-secondary);
}

.acciones {
  justify-content: flex-end;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

@media (max-width: 1100px) {
  .filtros-historial {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .filtros-historial {
    grid-template-columns: 1fr;
  }
}
</style>