<template>
  <div class="formulario-producto">
    <div class="header">
      <h2>{{ titulo }}</h2>
      <button v-if="productoId" @click="cerrar" class="btn-close">✕</button>
    </div>

    <form @submit.prevent="guardar" class="form">
      <div class="form-group">
        <label for="codigo_sku">Codigo SKU</label>
        <input id="codigo_sku" v-model="formulario.codigo_sku" type="text" placeholder="Ej: SKU-001" />
      </div>

      <div class="form-group">
        <label for="nombre">Nombre *</label>
        <input id="nombre" v-model="formulario.nombre" type="text" placeholder="Ej: Teclado mecanico" required />
      </div>

      <div class="form-group">
        <label for="id_categoria">Categoria *</label>
        <select id="id_categoria" v-model.number="formulario.id_categoria" required>
          <option :value="null" disabled>Selecciona una categoria</option>
          <option v-for="categoria in categorias" :key="categoria.id_categoria" :value="categoria.id_categoria">
            {{ categoria.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="id_proveedor">Proveedor *</label>
        <select id="id_proveedor" v-model.number="formulario.id_proveedor" required>
          <option :value="null" disabled>Selecciona un proveedor</option>
          <option v-for="proveedor in proveedores" :key="proveedor.id_proveedor" :value="proveedor.id_proveedor">
            {{ proveedor.nombre_empresa }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="precio_compra">Precio Compra</label>
          <input id="precio_compra" v-model.number="formulario.precio_compra" type="number" min="0" step="1" />
        </div>
        <div class="form-group">
          <label for="precio_venta">Precio Venta</label>
          <input id="precio_venta" v-model.number="formulario.precio_venta" type="number" min="0" step="1" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="stock_actual">Stock Actual</label>
          <input id="stock_actual" v-model.number="formulario.stock_actual" type="number" min="1" step="1" />
        </div>
        <div class="form-group">
          <label for="stock_minimo">Stock Minimo</label>
          <input id="stock_minimo" v-model.number="formulario.stock_minimo" type="number" min="1" step="1" />
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary" :disabled="cargando">
          {{ cargando ? 'Guardando...' : productoId ? 'Actualizar' : 'Agregar' }}
        </button>
        <button type="button" @click="cerrar" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  productoId: {
    type: Number,
    default: null
  },
  productoData: {
    type: Object,
    default: null
  },
  categorias: {
    type: Array,
    default: () => []
  },
  proveedores: {
    type: Array,
    default: () => []
  },
  cargando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['guardar', 'cerrar'])

const formulario = ref({
  codigo_sku: '',
  nombre: '',
  id_categoria: null,
  id_proveedor: null,
  precio_compra: 0,
  precio_venta: 0,
  stock_actual: 1,
  stock_minimo: 1
})

const titulo = ref('Nuevo Producto')

watch(
  () => props.productoData,
  (newVal) => {
    if (newVal) {
      formulario.value = {
        codigo_sku: newVal.codigo_sku ?? '',
        nombre: newVal.nombre ?? '',
        id_categoria: newVal.id_categoria ?? null,
        id_proveedor: newVal.id_proveedor ?? null,
        precio_compra: Number(newVal.precio_compra ?? 0),
        precio_venta: Number(newVal.precio_venta ?? 0),
        stock_actual: Number(newVal.stock_actual ?? 1),
        stock_minimo: Number(newVal.stock_minimo ?? 1)
      }
      titulo.value = 'Editar Producto'
    } else {
      formulario.value = {
        codigo_sku: '',
        nombre: '',
        id_categoria: null,
        id_proveedor: null,
        precio_compra: 0,
        precio_venta: 0,
        stock_actual: 1,
        stock_minimo: 1
      }
      titulo.value = 'Nuevo Producto'
    }
  },
  { immediate: true }
)

const guardar = () => {
  emit('guardar', { ...formulario.value })
}

const cerrar = () => {
  emit('cerrar')
}

const resetForm = () => {
  formulario.value = {
    codigo_sku: '',
    nombre: '',
    id_categoria: null,
    id_proveedor: null,
    precio_compra: 0,
    precio_venta: 0,
    stock_actual: 1,
    stock_minimo: 1
  }
  titulo.value = 'Nuevo Producto'
}

defineExpose({ resetForm })
</script>

<style scoped>
.formulario-producto {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--primary);
}

.btn-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group select {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>