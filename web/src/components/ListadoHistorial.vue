<template>
  <div class="listado-historial">
    <div v-if="movimientos.length === 0" class="empty-state">
      <p>No hay movimientos para mostrar.</p>
    </div>

    <div v-else class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in movimientos" :key="mov.id_movimiento" class="fila">
            <td>{{ formatDate(mov.fecha_hora) }}</td>
            <td>{{ mov.nombre_producto }}</td>
            <td>
              <span :class="['badge', mov.tipo_movimiento === 'entrada' ? 'entrada' : 'salida']">
                {{ mov.tipo_movimiento }}
              </span>
            </td>
            <td>{{ mov.cantidad }}</td>
            <td>{{ mov.motivo || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  movimientos: {
    type: Array,
    required: true
  }
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('es-CL')
}
</script>

<style scoped>
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

.tabla th,
.tabla td {
  padding: var(--spacing-md);
  text-align: left;
}

.tabla th {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--text-primary);
}

.tabla td {
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
}

.fila:hover {
  background-color: var(--bg-tertiary);
}

.badge {
  display: inline-block;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 0.82rem;
  text-transform: capitalize;
}

.badge.entrada {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
}

.badge.salida {
  background: rgba(239, 68, 68, 0.2);
  color: var(--error);
}
</style>