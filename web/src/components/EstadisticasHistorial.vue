<template>
  <div class="estadisticas-historial">
    <div class="stats-grid">
      <div class="estadistica-card">
        <div class="numero">{{ totalMovimientos }}</div>
        <div class="label">Movimientos</div>
      </div>
      <div class="estadistica-card success">
        <div class="numero">{{ totalEntradas }}</div>
        <div class="label">Entradas</div>
      </div>
      <div class="estadistica-card error">
        <div class="numero">{{ totalSalidas }}</div>
        <div class="label">Salidas</div>
      </div>
      <div class="estadistica-card info">
        <div class="numero">{{ movimientosHoy }}</div>
        <div class="label">Hoy</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movimientos: {
    type: Array,
    required: true
  }
})

const totalMovimientos = computed(() => props.movimientos.length)
const totalEntradas = computed(() => props.movimientos.filter(m => m.tipo_movimiento === 'entrada').length)
const totalSalidas = computed(() => props.movimientos.filter(m => m.tipo_movimiento === 'salida').length)
const movimientosHoy = computed(() => {
  const hoy = new Date()
  return props.movimientos.filter((mov) => {
    const fecha = new Date(mov.fecha_hora)
    return (
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate()
    )
  }).length
})
</script>

<style scoped>
.estadisticas-historial {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.estadistica-card {
  text-align: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.numero {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: var(--spacing-sm);
}

.label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.success .numero {
  color: var(--success);
}

.error .numero {
  color: var(--error);
}

.info .numero {
  color: var(--info);
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>