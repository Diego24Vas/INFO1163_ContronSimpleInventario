<template>
  <div class="historial-view">
    <h1>Historial de Movimientos</h1>

    <div class="filtros-section">
      <FiltrosHistorial :productos="productos" @cambiar="actualizarFiltros" />
    </div>

    <div class="estadisticas-section">
      <EstadisticasHistorial :movimientos="movimientosFiltrados" />
    </div>

    <div class="listado-section">
      <h2>Listado de Movimientos</h2>
      <div v-if="cargando" class="loading">Cargando...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <ListadoHistorial v-else :movimientos="movimientosFiltrados" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import FiltrosHistorial from '../components/FiltrosHistorial.vue'
import ListadoHistorial from '../components/ListadoHistorial.vue'
import EstadisticasHistorial from '../components/EstadisticasHistorial.vue'
import { useHistorial } from '../composables/useHistorial'

const { movimientos, productos, cargando, error, cargarHistorial } = useHistorial()

const filtros = ref({
  id_producto: null,
  tipo_movimiento: '',
  fecha_inicio: '',
  fecha_fin: ''
})

const movimientosFiltrados = computed(() => {
  let resultado = movimientos.value

  if (filtros.value.id_producto) {
    resultado = resultado.filter((mov) => Number(mov.id_producto) === Number(filtros.value.id_producto))
  }

  if (filtros.value.tipo_movimiento) {
    resultado = resultado.filter((mov) => mov.tipo_movimiento === filtros.value.tipo_movimiento)
  }

  if (filtros.value.fecha_inicio) {
    const inicio = new Date(`${filtros.value.fecha_inicio}T00:00:00`)
    resultado = resultado.filter((mov) => new Date(mov.fecha_hora) >= inicio)
  }

  if (filtros.value.fecha_fin) {
    const fin = new Date(`${filtros.value.fecha_fin}T23:59:59`)
    resultado = resultado.filter((mov) => new Date(mov.fecha_hora) <= fin)
  }

  return resultado
})

const actualizarFiltros = (nuevosFiltros) => {
  filtros.value = nuevosFiltros
}

onMounted(() => {
  cargarHistorial()
})
</script>

<style scoped>
.historial-view {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.historial-view h1 {
  margin-bottom: var(--spacing-xl);
}

.filtros-section {
  margin-bottom: var(--spacing-xl);
}

.estadisticas-section {
  margin-bottom: var(--spacing-xl);
}

.listado-section h2 {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--primary);
  font-size: 1.3rem;
}

.loading {
  text-align: center;
  color: var(--text-muted);
  padding: var(--spacing-2xl);
}

.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--error);
}

@media (max-width: 768px) {
  .historial-view {
    padding: var(--spacing-lg);
  }
}
</style>
