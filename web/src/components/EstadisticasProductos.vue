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
      <div class="estadistica-card info">
        <div class="numero">{{ totalCategorias }}</div>
        <div class="label">Categorias</div>
      </div>
      <div class="estadistica-card success">
        <div class="numero">{{ totalProveedores }}</div>
        <div class="label">Proveedores</div>
      </div>
    </div>

    <div class="resumen-stock">
      <span class="resumen-label">Stock total en inventario</span>
      <strong>{{ stockTotal }}</strong>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  productos: {
    type: Array,
    required: true
  },
  categorias: {
    type: Array,
    default: () => []
  },
  proveedores: {
    type: Array,
    default: () => []
  }
})

const totalProductos = computed(() => props.productos.length)
const stockBajo = computed(() => props.productos.filter(p => p.stock_actual <= p.stock_minimo).length)
const totalCategorias = computed(() => props.categorias.length)
const totalProveedores = computed(() => props.proveedores.length)
const stockTotal = computed(() => props.productos.reduce((total, producto) => total + Number(producto.stock_actual || 0), 0))
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

.info .numero {
  color: var(--info);
}

.success .numero {
  color: var(--success);
}

.label {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.resumen-stock {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  color: var(--text-primary);
}

.resumen-label {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .resumen-stock {
    flex-direction: column;
  }
}
</style>