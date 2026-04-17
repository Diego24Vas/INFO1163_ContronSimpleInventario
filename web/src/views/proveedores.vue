<template>
  <div class="proveedores">
    <h1>Gestión de Proveedores</h1>

    <div class="contenido">
      <div class="formulario-section">
        <FormularioProveedor
          ref="formProveedorRef"
          :proveedor-id="proveedorEdicion?.id_proveedor"
          :proveedor-data="proveedorEdicion"
          :cargando="cargando"
          @guardar="guardarProveedor"
          @cerrar="cerrarFormulario"
        />
      </div>

      <div class="estadisticas-section">
        <EstadisticasProveedores 
          :proveedores="proveedores"
          :total-proveedores-real="totalRegistros"
        />
      </div>
    </div>

    <div class="listado-section">
      <h2>Listado de Proveedores</h2>
      <div v-if="cargando" class="loading">Cargando...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <ListadoProveedores
          :proveedores="proveedores"
          :eliminando="eliminando"
          @editar="editarProveedor"
          @eliminar="eliminarProveedor"
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
import { ref, onMounted } from 'vue';
import FormularioProveedor from '../components/FormularioProveedor.vue';
import ListadoProveedores from '../components/ListadoProveedores.vue';
import EstadisticasProveedores from '../components/EstadisticasProveedores.vue';
import Paginador from '../components/Paginador.vue';
import { useProveedores } from '../composables/useProveedores';

const {
  proveedores,
  cargando,
  error,
  paginaActual,
  totalPaginas,
  totalRegistros,
  tamanoPagina,
  cargarProveedores,
  irPaginaSiguiente,
  irPaginaAnterior,
  irPagina,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor: eliminarProveedorService
} = useProveedores();

const proveedorEdicion = ref(null);
const eliminando = ref(false);
const formProveedorRef = ref(null);
const mensajeExito = ref('');
const mensajeError = ref('');

onMounted(() => {
  cargarProveedores();
});

const guardarProveedor = async (datos) => {
  let resultado;
  
  if (proveedorEdicion.value) {
    resultado = await actualizarProveedor(proveedorEdicion.value.id_proveedor, datos);
  } else {
    resultado = await crearProveedor(datos);
  }

  if (resultado.success) {
    mensajeExito.value = 'Proveedor guardado exitosamente.';
    cerrarFormulario();
    cargarProveedores();
  } else {
    mensajeError.value = resultado.error || 'Error al guardar el proveedor.';
  }

  setTimeout(() => {
    mensajeExito.value = '';
    mensajeError.value = '';
  }, 3000);
};

const editarProveedor = (proveedor) => {
  proveedorEdicion.value = proveedor;
};

const eliminarProveedor = async (id) => {
  eliminando.value = true;
  const resultado = await eliminarProveedorService(id);
  eliminando.value = false;

  if (resultado.success) {
    cargarProveedores();
  } else {
    mensajeError.value = resultado.error || 'Error al eliminar el proveedor.';
    setTimeout(() => {
      mensajeError.value = '';
    }, 3000);
  }
};

const cerrarFormulario = () => {
  formProveedorRef.value?.resetForm();
  proveedorEdicion.value = null;
};
</script>

<style scoped>
.proveedores {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.proveedores h1 {
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
  .proveedores {
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