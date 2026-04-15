<template>
  <div class="formulario-proveedor">
    <div class="header">
      <h2>{{ titulo }}</h2>
      <button v-if="proveedorId" @click="cerrar" class="btn-close">✕</button>
    </div>

    <form @submit.prevent="guardar" class="form">
      <div class="form-group">
        <label for="nombre_empresa">Nombre Empresa *</label>
        <input
          id="nombre_empresa"
          v-model="formulario.nombre_empresa"
          type="text"
          placeholder="Ej: Acme Corp"
          required
        />
      </div>

      <div class="form-group">
        <label for="nombre_contacto">Nombre Contacto *</label>
        <input
          id="nombre_contacto"
          v-model="formulario.nombre_contacto"
          type="text"
          placeholder="Ej: Juan Pérez"
          required
        />
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono *</label>
        <input
          id="telefono"
          v-model="formulario.telefono"
          type="tel"
          placeholder="Ej: +56912345678"
          required
        />
      </div>

      <div class="form-group">
        <label for="correo">Correo *</label>
        <input
          id="correo"
          v-model="formulario.correo"
          type="email"
          placeholder="Ej: contacto@empresa.com"
          required
        />
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary" :disabled="cargando">
          {{ cargando ? 'Guardando...' : proveedorId ? 'Actualizar' : 'Agregar' }}
        </button>
        <button type="button" @click="cerrar" class="btn btn-secondary">
          Cancelar
        </button>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  proveedorId: {
    type: Number,
    default: null
  },
  proveedorData: {
    type: Object,
    default: null
  },
  cargando: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['guardar', 'cerrar']);

const formulario = ref({
  nombre_empresa: '',
  nombre_contacto: '',
  telefono: '',
  correo: ''
});

const error = ref('');
const titulo = ref('Nuevo Proveedor');

watch(() => props.proveedorData, (newVal) => {
  if (newVal) {
    formulario.value = { ...newVal };
    titulo.value = 'Editar Proveedor';
  } else {
    formulario.value = {
      nombre_empresa: '',
      nombre_contacto: '',
      telefono: '',
      correo: ''
    };
    titulo.value = 'Nuevo Proveedor';
  }
  error.value = '';
}, { immediate: true });

const guardar = () => {
  error.value = '';
  emit('guardar', formulario.value);
};

const cerrar = () => {
  emit('cerrar');
};

const resetForm = () => {
  formulario.value = {
    nombre_empresa: '',
    nombre_contacto: '',
    telefono: '',
    correo: ''
  };
  titulo.value = 'Nuevo Proveedor';
  error.value = '';
};

defineExpose({ resetForm });
</script>

<style scoped>
.formulario-proveedor {
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

.form-group input {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color var(--transition-fast);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--bg-tertiary);
}

.form-group input::placeholder {
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
  font-size: 0.875rem;
  border-left: 3px solid var(--error);
}
</style>
