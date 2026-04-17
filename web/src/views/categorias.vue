<template>
  <div class="categorias-view">
    <h1>Gestion de Categorias</h1>

    <div class="contenido">
      <div class="formulario-section">
        <FormularioCategoria
          ref="formCategoriaRef"
          :categoria-id="categoriaEdicion?.id_categoria"
          :categoria-data="categoriaEdicion"
          :cargando="cargando"
          @guardar="guardarCategoria"
          @cerrar="cerrarFormulario"
        />
      </div>

      <div class="estadisticas-section">
        <EstadisticasCategorias 
          :categorias="categorias"
          :total-categorias-real="totalRegistros"
        />
      </div>
    </div>

    <div class="listado-section">
      <h2>Listado de Categorias</h2>
      <div v-if="mensajeError" class="mensaje-error">{{ mensajeError }}</div>
      <div v-if="cargando" class="loading">Cargando...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <ListadoCategorias
          :categorias="categorias"
          :eliminando="eliminando"
          @editar="editarCategoria"
          @eliminar="eliminarCategoria"
        />
        <Paginador
          v-if="totalRegistros > 100"
          :pagina-actual="paginaActual"
          :total-paginas="totalPaginas"
          :total-registros="totalRegistros"
          :tamanio-pagina="tamanoPagina"
          @anterior="irPaginaAnterior"
          @siguiente="irPaginaSiguiente"
          @ir-pagina="irPagina"
        />
      </div>
    </div>

    <div v-if="mensajeExito" class="mensaje-exito">{{ mensajeExito }}</div>
    <div v-if="mensajeError" class="mensaje-error">{{ mensajeError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FormularioCategoria from '../components/FormularioCategoria.vue'
import ListadoCategorias from '../components/ListadoCategorias.vue'
import EstadisticasCategorias from '../components/EstadisticasCategorias.vue'
import Paginador from '../components/Paginador.vue'
import { useCategorias } from '../composables/useCategorias'

const {
  categorias,
  cargando,
  error,
  paginaActual,
  totalPaginas,
  totalRegistros,
  tamanoPagina,
  cargarCategorias,
  irPaginaSiguiente,
  irPaginaAnterior,
  irPagina,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria: eliminarCategoriaService
} = useCategorias()

const categoriaEdicion = ref(null)
const eliminando = ref(false)
const formCategoriaRef = ref(null)
const mensajeExito = ref('')
const mensajeError = ref('')

onMounted(() => {
  cargarCategorias()
})

const guardarCategoria = async (datos) => {
  let resultado

  if (categoriaEdicion.value) {
    resultado = await actualizarCategoria(categoriaEdicion.value.id_categoria, datos)
  } else {
    resultado = await crearCategoria(datos)
  }

  if (resultado.success) {
    mensajeExito.value = 'Categoría guardada exitosamente.'
    cerrarFormulario()
    cargarCategorias() // Refrescar la lista
  } else {
    mensajeError.value = resultado.error || 'Error al guardar la categoría.'
  }

  setTimeout(() => {
    mensajeExito.value = ''
    mensajeError.value = ''
  }, 3000) // Limpiar mensajes después de 3 segundos
}

const editarCategoria = (categoria) => {
  categoriaEdicion.value = categoria
}

const eliminarCategoria = async (id) => {
  eliminando.value = true
  const resultado = await eliminarCategoriaService(id)
  eliminando.value = false

  if (resultado.success) {
    cargarCategorias() // Refrescar la lista
  } else {
    mensajeError.value = resultado.error || 'Error al eliminar la categoría.'
    setTimeout(() => {
      mensajeError.value = ''
    }, 3000) // Limpiar mensaje después de 3 segundos
  }
}

const cerrarFormulario = () => {
  formCategoriaRef.value?.resetForm()
  categoriaEdicion.value = null
}
</script>

<style scoped>
.categorias-view {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.categorias-view h1 {
  margin-bottom: var(--spacing-xl);
}

.contenido {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
  margin-bottom: var(--spacing-2xl);
}

.formulario-section {
  position: sticky;
  top: var(--spacing-xl);
}

.estadisticas-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.listado-section {
  margin-top: var(--spacing-2xl);
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

.mensaje-exito {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(16, 185, 129, 0.95);
  color: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--success);
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

.mensaje-error {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(239, 68, 68, 0.95);
  color: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--error);
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .contenido {
    grid-template-columns: 1fr;
  }

  .formulario-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .categorias-view {
    padding: var(--spacing-lg);
  }

  .contenido {
    gap: var(--spacing-lg);
  }

  .listado-section {
    padding: var(--spacing-lg);
  }
}
</style>
