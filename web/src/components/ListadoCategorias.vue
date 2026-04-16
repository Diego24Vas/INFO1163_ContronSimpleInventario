<template>
  <div class="listado-categorias">
    <div v-if="categorias.length === 0" class="empty-state">
      <p>No hay categorias registradas</p>
    </div>

    <div v-else class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="categoria in categorias" :key="categoria.id_categoria" class="fila">
            <td>{{ categoria.nombre }}</td>
            <td>{{ categoria.descripcion || '-' }}</td>
            <td class="acciones">
              <button @click="editar(categoria)" class="btn-accion btn-editar" title="Editar">✎</button>
              <button @click="eliminaConfirm(categoria)" class="btn-accion btn-eliminar" title="Eliminar">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarConfirmacion" class="modal-overlay" @click.self="cancelarEliminacion">
      <div class="modal-contenido">
        <h3>¿Eliminar Categoria?</h3>
        <p>{{ categoriaAEliminar?.nombre }}</p>
        <p class="advertencia">Esta accion no se puede deshacer</p>
        <div class="modal-acciones">
          <button @click="confirmarEliminar" class="btn btn-eliminar-confirm" :disabled="eliminando">
            {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
          </button>
          <button @click="cancelarEliminacion" class="btn btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  categorias: {
    type: Array,
    required: true
  },
  eliminando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['editar', 'eliminar'])

const mostrarConfirmacion = ref(false)
const categoriaAEliminar = ref(null)

const editar = (categoria) => {
  emit('editar', categoria)
}

const eliminaConfirm = (categoria) => {
  categoriaAEliminar.value = categoria
  mostrarConfirmacion.value = true
}

const confirmarEliminar = () => {
  emit('eliminar', categoriaAEliminar.value.id_categoria)
  mostrarConfirmacion.value = false
}

const cancelarEliminacion = () => {
  mostrarConfirmacion.value = false
  categoriaAEliminar.value = null
}
</script>

<style scoped>
.listado-categorias {
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

.btn-cancelar {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-cancelar:hover {
  background-color: var(--border-light);
}
</style>