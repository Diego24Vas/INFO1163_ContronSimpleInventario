<template>
  <div class="estadisticas-productos">
    <div class="stats-grid">
      <div class="estadistica-card">
        <div class="numero">{{ totalProductos }}</div>
        <div class="label">Productos</div>
      </div>
      <div class="estadistica-card warning">
        <div class="numero">{{ stockBajo }}</div>
        <div class="label">Stock Bajo</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  productos: {
    type: Array,
    required: true
  }
})

const totalProductos = computed(() => props.productos.length)
const stockBajo = computed(() => props.productos.filter(p => p.stock_actual <= p.stock_minimo).length)
</script>

<style scoped>
.estadisticas-productos {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  font-weight: bold;
  line-height: 1;
  margin-bottom: var(--spacing-sm);
  color: var(--primary);
}

.warning .numero {
  color: var(--warning);
}

.label {
  font-size: 0.95rem;
  color: var(--text-secondary);
}
</style>