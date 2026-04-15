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

      <div class="listado-section">
        <div v-if="cargando" class="loading">Cargando...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <ListadoProveedores
          v-else
          :proveedores="proveedores"
          :eliminando="eliminando"
          @editar="editarProveedor"
          @eliminar="eliminarProveedor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FormularioProveedor from '../components/FormularioProveedor.vue';
import ListadoProveedores from '../components/ListadoProveedores.vue';
import { useProveedores } from '../composables/useProveedores';

const {
  proveedores,
  cargando,
  error,
  cargarProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor: eliminarProveedorService
} = useProveedores();

const proveedorEdicion = ref(null);
const eliminando = ref(false);
const formProveedorRef = ref(null);

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
    cerrarFormulario();
  }
};

const editarProveedor = (proveedor) => {
  proveedorEdicion.value = proveedor;
};

const eliminarProveedor = async (id) => {
  eliminando.value = true;
  await eliminarProveedorService(id);
  eliminando.value = false;
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
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.formulario-section {
  position: sticky;
  top: var(--spacing-xl);
}

.listado-section {
  min-height: 300px;
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

@media (max-width: 968px) {
  .contenido {
    grid-template-columns: 1fr;
  }

  .formulario-section {
    position: static;
  }
}
</style>