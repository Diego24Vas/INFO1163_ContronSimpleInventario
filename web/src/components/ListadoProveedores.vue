<template>
  <div class="listado-proveedores">
    <div v-if="proveedores.length === 0" class="empty-state">
      <p>No hay proveedores registrados</p>
    </div>

    <div v-else class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Empresa</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proveedor in proveedores" :key="proveedor.id_proveedor" class="fila">
            <td class="id">{{ proveedor.id_proveedor }}</td>
            <td>{{ proveedor.nombre_empresa }}</td>
            <td>{{ proveedor.nombre_contacto }}</td>
            <td>{{ proveedor.telefono }}</td>
            <td class="correo">{{ proveedor.correo }}</td>
            <td class="acciones">
              <button
                @click="editar(proveedor)"
                class="btn-accion btn-editar"
                title="Editar"
              >
                ✎
              </button>
              <button
                @click="eliminaConfirm(proveedor)"
                class="btn-accion btn-eliminar"
                title="Eliminar"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarConfirmacion" class="modal-overlay" @click.self="cancelarEliminacion">
      <div class="modal-contenido">
        <h3>¿Eliminar Proveedor?</h3>
        <p>{{ proveedorAEliminar?.nombre_empresa }}</p>
        <p class="advertencia">Esta acción no se puede deshacer</p>
        <div class="modal-acciones">
          <button @click="confirmaryEliminar" class="btn btn-eliminar-confirm" :disabled="eliminando">
            {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
          </button>
          <button @click="cancelarEliminacion" class="btn btn-cancelar">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  proveedores: {
    type: Array,
    required: true
  },
  eliminando: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['editar', 'eliminar']);

const mostrarConfirmacion = ref(false);
const proveedorAEliminar = ref(null);

const editar = (proveedor) => {
  emit('editar', proveedor);
};

const eliminaConfirm = (proveedor) => {
  proveedorAEliminar.value = proveedor;
  mostrarConfirmacion.value = true;
};

const confirmaryEliminar = () => {
  emit('eliminar', proveedorAEliminar.value.id_proveedor);
  mostrarConfirmacion.value = false;
};

const cancelarEliminacion = () => {
  mostrarConfirmacion.value = false;
  proveedorAEliminar.value = null;
};
</script>

<style scoped>
.listado-proveedores {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
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

.tabla .id {
  color: var(--primary);
  font-weight: 500;
}

.tabla .correo {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.acciones {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-accion {
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: background-color var(--transition-fast);
}

.btn-editar {
  color: var(--info);
}

.btn-editar:hover {
  background-color: rgba(6, 182, 212, 0.1);
}

.btn-eliminar {
  color: var(--error);
}

.btn-eliminar:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-contenido {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-contenido h3 {
  margin-top: 0;
  color: var(--error);
  font-size: 1.25rem;
}

.modal-contenido p {
  margin: var(--spacing-sm) 0;
  color: var(--text-secondary);
}

.advertencia {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
}

.modal-acciones {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  flex: 1;
}

.btn-eliminar-confirm {
  background-color: var(--error);
  color: white;
}

.btn-eliminar-confirm:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-eliminar-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancelar {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-cancelar:hover {
  background-color: var(--border-light);
}
</style>
