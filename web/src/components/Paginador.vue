<template>
  <div class="paginador">
    <div class="info-paginacion">
      <span class="texto-paginacion">
        Página {{ paginaActual + 1 }} de {{ totalPaginas }} 
        <span v-if="totalRegistros" class="total-registros">({{ totalRegistros }} registros total)</span>
      </span>
    </div>
    
    <div class="controles-paginacion">
      <button 
        @click="$emit('anterior')" 
        :disabled="paginaActual === 0"
        class="btn-pagina btn-anterior"
        title="Página anterior"
      >
        <i class="fa-solid fa-chevron-left"></i> Anterior
      </button>

      <div class="selectores-pagina">
        <button 
          v-for="pagina in paginasVisibles" 
          :key="pagina"
          @click="$emit('ir-pagina', pagina)"
          :class="['btn-numero', { activa: pagina === paginaActual }]"
        >
          {{ pagina + 1 }}
        </button>
      </div>

      <button 
        @click="$emit('siguiente')" 
        :disabled="paginaActual >= totalPaginas - 1"
        class="btn-pagina btn-siguiente"
        title="Página siguiente"
      >
        Siguiente <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="tamanio-pagina">
      <span>Mostrando {{ registrosEnPagina }} registros por página</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  paginaActual: {
    type: Number,
    required: true
  },
  totalPaginas: {
    type: Number,
    required: true
  },
  totalRegistros: {
    type: Number,
    required: true
  },
  tamanoPagina: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['anterior', 'siguiente', 'ir-pagina'])

const registrosEnPagina = computed(() => {
  return props.tamanoPagina
})

// Mostrar máximo 5 botones de página
const paginasVisibles = computed(() => {
  const paginas = []
  const ventana = 5 // Cantidad de botones de página a mostrar
  let inicio = Math.max(0, props.paginaActual - Math.floor(ventana / 2))
  let fin = Math.min(props.totalPaginas, inicio + ventana)
  
  // Ajustar el inicio si llegamos al final
  if (fin - inicio < ventana) {
    inicio = Math.max(0, fin - ventana)
  }
  
  for (let i = inicio; i < fin; i++) {
    paginas.push(i)
  }
  
  return paginas
})
</script>

<style scoped>
.paginador {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  align-items: center;
}

.info-paginacion {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.texto-paginacion {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.total-registros {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.controles-paginacion {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
}

.btn-pagina {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-pagina:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-pagina:disabled {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.btn-anterior, .btn-siguiente {
  font-weight: 600;
}

.selectores-pagina {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-numero {
  min-width: 40px;
  height: 40px;
  padding: 0 var(--spacing-sm);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-numero:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-numero.activa {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.tamanio-pagina {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

@media (max-width: 768px) {
  .paginador {
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }

  .controles-paginacion {
    gap: var(--spacing-sm);
  }

  .btn-pagina {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.85rem;
  }

  .btn-numero {
    min-width: 32px;
    height: 32px;
  }
}
</style>
