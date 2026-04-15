<template>
  <div class="estadisticas-proveedores">
    <div class="estadistica-card">
      <div class="numero">{{ totalProveedores }}</div>
      <div class="label">Proveedores Totales</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  proveedores: {
    type: Array,
    required: true
  }
});

const totalProveedores = computed(() => {
  return props.proveedores.length;
});
</script>

<style scoped>
.estadisticas-proveedores {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.estadistica-card {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.numero {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: var(--spacing-md);
  color: var(--primary);
}

.label {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
