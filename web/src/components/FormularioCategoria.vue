<template>
  <div class="formulario-categoria">
    <div class="header">
      <h2>{{ titulo }}</h2>
      <button v-if="categoriaId" @click="cerrar" class="btn-close">✕</button>
    </div>

    <form @submit.prevent="guardar" class="form">
      <div class="form-group">
        <label for="nombre">Nombre *</label>
        <input
          id="nombre"
          v-model="formulario.nombre"
          type="text"
          placeholder="Ej: Electronica"
          required
        />
      </div>

      <div class="form-group">
        <label for="descripcion">Descripcion</label>
        <textarea
          id="descripcion"
          v-model="formulario.descripcion"
          rows="4"
          placeholder="Descripcion de la categoria"
        />
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary" :disabled="cargando">
          {{ cargando ? 'Guardando...' : categoriaId ? 'Actualizar' : 'Agregar' }}
        </button>
        <button type="button" @click="cerrar" class="btn btn-secondary">Cancelar</button>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categoriaId: {
    type: Number,
    default: null
  },
  categoriaData: {
    type: Object,
    default: null
  },
  cargando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['guardar', 'cerrar'])

const formulario = ref({
  nombre: '',
  descripcion: ''
})

const error = ref('')
const titulo = ref('Nueva Categoria')

watch(
  () => props.categoriaData,
  (newVal) => {
    if (newVal) {
      formulario.value = {
        nombre: newVal.nombre ?? '',
        descripcion: newVal.descripcion ?? ''
      }
      titulo.value = 'Editar Categoria'
    } else {
      formulario.value = {
        nombre: '',
        descripcion: ''
      }
      titulo.value = 'Nueva Categoria'
    }

    error.value = ''
  },
  { immediate: true }
)

const guardar = () => {
  error.value = ''
  emit('guardar', formulario.value)
}

const cerrar = () => {
  emit('cerrar')
}

const resetForm = () => {
  formulario.value = {
    nombre: '',
    descripcion: ''
  }
  titulo.value = 'Nueva Categoria'
  error.value = ''
}

defineExpose({ resetForm })
</script>

<style scoped>
.formulario-categoria {
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
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.btn-close:hover {
  color: var(--error);
}

.form {
  display: flex;
  flex-direction: column;
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
.form-group textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--bg-tertiary);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
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
  transition: background-color var(--transition-fast), opacity var(--transition-fast);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  flex: 1;
}

.btn-secondary:hover {
  background-color: var(--border-light);
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--error);
  font-size: 0.875rem;
}
</style>