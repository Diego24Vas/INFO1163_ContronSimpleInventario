<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

// Componentes PrimeVue
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'
import Card from 'primevue/card'

const toast = useToast()

// 1. Estado de los Productos (Visualizar Stock Actual)
const productos = ref([
  { id: 1, nombre: 'Producto A', stock: 10, categoria: 'Electrónica' },
  { id: 2, nombre: 'Producto B', stock: 5, categoria: 'Oficina' }
])

// Variables para formularios
const movementDialog = ref(false)
const product = ref({ nombre: '', stock: 0, categoria: '' })
const selectedProduct = ref(null)
const cantidadMovimiento = ref(0)
const tipoMovimiento = ref('') 

// --- FUNCIONES ---

const saveProduct = () => {
  if (product.value.nombre.trim()) {
    productos.value.push({ ...product.value, id: Date.now() })
    product.value = { nombre: '', stock: 0, categoria: '' }
    toast.add({ severity: 'success', summary: 'Registrado', detail: 'Producto añadido al inventario', life: 3000 })
  }
}

const openMovement = (prod, tipo) => {
  selectedProduct.value = prod
  tipoMovimiento.value = tipo
  cantidadMovimiento.value = 0
  movementDialog.value = true
}

const applyMovement = () => {
  const p = productos.value.find(x => x.id === selectedProduct.value.id)
  if (tipoMovimiento.value === 'entrada') {
    p.stock += cantidadMovimiento.value
  } else {
    if (p.stock >= cantidadMovimiento.value) {
      p.stock -= cantidadMovimiento.value
    } else {
      return toast.add({ severity: 'error', summary: 'Error', detail: 'Stock insuficiente', life: 3000 })
    }
  }
  movementDialog.value = false
  toast.add({ severity: 'info', summary: 'Actualizado', detail: `Se registró una ${tipoMovimiento.value}`, life: 3000 })
}

const getStockSeverity = (stock) => {
  if (stock > 5) return 'success'
  if (stock > 0) return 'warning'
  return 'danger'
}
</script>

<template>
  <div class="inventory-container">
    <Toast />
    
    <div class="inventory-header">
      <div class="header-content">
        <h1>Gestión de Inventario</h1>
        <p>Control de stock y movimientos</p>
      </div>
    </div>

    <Card class="custom-card mb-6">
      <template #title>
        <span class="card-title"><i class="pi pi-plus-circle"></i> Registrar Nuevo Producto</span>
      </template>
      <template #content>
        <div class="horizontal-form">
          <div class="field">
            <label>Nombre</label>
            <InputText v-model="product.nombre" placeholder="Nombre del ítem" />
          </div>
          <div class="field">
            <label>Categoría</label>
            <InputText v-model="product.categoria" placeholder="Categoría" />
          </div>
          <div class="field">
            <label>Stock Inicial</label>
            <InputNumber v-model="product.stock" :min="0" />
          </div>
          <div class="field align-self-end">
            <Button label="Agregar al Inventario" icon="pi pi-plus" @click="saveProduct" class="p-button-sm" />
          </div>
        </div>
      </template>
    </Card>

    <div class="table-card">
      <DataTable :value="productos" responsiveLayout="scroll" class="p-datatable-minimal">
        <Column field="nombre" header="Nombre del Producto"></Column>
        <Column field="categoria" header="Categoría"></Column>
        <Column field="stock" header="Stock Actual">
          <template #body="slotProps">
            <Tag :value="slotProps.data.stock" :severity="getStockSeverity(slotProps.data.stock)" />
          </template>
        </Column>
        <Column header="Movimientos" headerStyle="width: 10rem">
          <template #body="slotProps">
            <div class="movement-actions">
              <Button label="Entrada" icon="pi pi-plus" class="btn-entrada" @click="openMovement(slotProps.data, 'entrada')" />
              <Button label="Salida" icon="pi pi-minus" class="btn-salida" @click="openMovement(slotProps.data, 'salida')" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

 
    <Dialog v-model:visible="movementDialog" :header="'Registrar ' + tipoMovimiento" :modal="true" :draggable="false" class="minimal-dialog">
      <div class="movement-content">
        <p>Ajustando stock para: <strong>{{ selectedProduct?.nombre }}</strong></p>
        <InputNumber v-model="cantidadMovimiento" showButtons :min="1" class="w-full mt-2" placeholder="Cantidad" />
      </div>
      <template #footer>
        <Button label="Confirmar" @click="applyMovement" class="w-full" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* Contenedor que usa todo el ancho */
.inventory-container {
  padding: 2rem 4rem;
  background-color: #16171d;
  width: 100%;
  box-sizing: border-box;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  text-align: left;
}

.header-content h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--text-h);
}

.header-content p {
  color: var(--text);
  margin-top: 0.5rem;
}

.custom-card {
  background: #1f2028 !important; 
  border: 1px solid #2e303a !important;
  color: #f3f4f6 !important;
  width: 100%; /* Asegura que ambas tarjetas midan lo mismo */
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.horizontal-form {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap; /* Para que sea responsivo si se achica la pantalla */
}

/* Tarjeta de la tabla */
.table-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

/* Estilos de la tabla minimalista */
:deep(.p-datatable-minimal .p-datatable-thead > tr > th) {
  background: var(--code-bg);
  color: var(--text-h);
  border-bottom: 1px solid var(--border);
  padding: 1.25rem 1rem;
  font-size: 0.85rem;
  text-transform: uppercase;
}

:deep(.p-datatable-minimal .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.movement-actions {
  display: flex;
  gap: 0.5rem;
}

:deep(.btn-entrada.p-button) {
  background: #16a34a !important;
  border-color: #16a34a !important;
  color: #ffffff !important;
}

:deep(.btn-entrada.p-button:hover) {
  background: #15803d !important;
  border-color: #15803d !important;
}

:deep(.btn-salida.p-button) {
  background: #dc2626 !important;
  border-color: #dc2626 !important;
  color: #ffffff !important;
}

:deep(.btn-salida.p-button:hover) {
  background: #b91c1c !important;
  border-color: #b91c1c !important;
}

/* Formularios */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.field label {
  font-weight: 500;
  color: var(--text-h);
}

.movement-content {
  padding: 1rem 0;
  text-align: left;
}

:deep(#app) {
  width: 100% !important;
  max-width: 100% !important;
  border-inline: none !important;
}
</style>