<script setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import { categoriasService, productosService } from '../service'

const toast = useToast()

const categorias = ref([
  { id_categoria: 1, nombre: 'Electronica', descripcion: 'Dispositivos y accesorios' },
  { id_categoria: 2, nombre: 'Oficina', descripcion: 'Insumos y materiales de trabajo' }
])

const productos = ref([
  {
    id: 1,
    codigo_sku: 'SKU-001',
    nombre: 'Producto A',
    descripcion: 'Producto de ejemplo',
    precio_compra: 12000,
    precio_venta: 15000,
    stock_actual: 10,
    stock_minimo: 5,
    id_categoria: 1,
    proveedor: 'Proveedor Demo'
  },
  {
    id: 2,
    codigo_sku: 'SKU-002',
    nombre: 'Producto B',
    descripcion: 'Producto de oficina',
    precio_compra: 8000,
    precio_venta: 11000,
    stock_actual: 5,
    stock_minimo: 3,
    id_categoria: 2,
    proveedor: 'Proveedor Demo'
  }
])

const categoriaForm = ref({ nombre: '', descripcion: '' })
const selectedCategoryFilter = ref(null)
const movementDialog = ref(false)
const product = ref({
  codigo_sku: '',
  nombre: '',
  descripcion: '',
  precio_compra: 0,
  precio_venta: 0,
  stock_actual: 0,
  stock_minimo: 0,
  id_categoria: null,
  proveedor: ''
})
const selectedProduct = ref(null)
const cantidadMovimiento = ref(0)
const tipoMovimiento = ref('')

const categoryOptions = computed(() =>
  categorias.value.map((categoria) => ({
    label: categoria.nombre,
    value: Number(categoria.id_categoria)
  }))
)

const filteredProducts = computed(() => {
  if (!selectedCategoryFilter.value) {
    return productos.value
  }

  return productos.value.filter((producto) => producto.id_categoria === selectedCategoryFilter.value)
})

const getCategoryName = (idCategoria) => {
  const categoria = categorias.value.find((item) => item.id_categoria === idCategoria)
  return categoria?.nombre ?? 'Sin categoria'
}

const mapDbProduct = (item) => ({
  id: item.id_producto,
  codigo_sku: item.codigo_sku ?? '',
  nombre: item.nombre ?? '',
  descripcion: item.descripcion ?? '',
  precio_compra: item.precio_compra ?? 0,
  precio_venta: item.precio_venta ?? 0,
  stock_actual: item.stock_actual ?? 0,
  stock_minimo: item.stock_minimo ?? 0,
  id_categoria: item.id_categoria ?? null,
  proveedor: item.id_proveedor ? `Proveedor #${item.id_proveedor}` : ''
})

const loadInitialData = async () => {
  const [categoriasRes, productosRes] = await Promise.all([
    categoriasService.obtenerTodas(),
    productosService.obtenerTodos()
  ])

  if (categoriasRes.success) {
    categorias.value = categoriasRes.data
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Categorias locales',
      detail: 'No se pudieron cargar categorias desde la base de datos',
      life: 3000
    })
  }

  if (productosRes.success) {
    productos.value = productosRes.data.map(mapDbProduct)
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Productos locales',
      detail: 'No se pudieron cargar productos desde la base de datos',
      life: 3000
    })
  }
}

const notifyLowStock = (producto) => {
  if (producto.stock_actual <= producto.stock_minimo) {
    toast.add({
      severity: 'warn',
      summary: 'Stock bajo',
      detail: `${producto.nombre} alcanzo el stock minimo (${producto.stock_actual}/${producto.stock_minimo})`,
      life: 4000
    })
  }
}

const saveCategory = async () => {
  if (!categoriaForm.value.nombre.trim()) {
    return
  }

  const payload = {
    nombre: categoriaForm.value.nombre.trim(),
    descripcion: categoriaForm.value.descripcion.trim() || null
  }

  const res = await categoriasService.crear(payload)
  if (!res.success) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: res.error || 'No se pudo registrar la categoria en la base de datos',
      life: 3500
    })
    return
  }

  categorias.value.push(res.data)

  categoriaForm.value = { nombre: '', descripcion: '' }

  toast.add({
    severity: 'success',
    summary: 'Categoria creada',
    detail: 'Categoria registrada en la base de datos',
    life: 3000
  })
}

const saveProduct = async () => {
  if (!product.value.nombre.trim()) {
    return
  }

  if (!product.value.id_categoria) {
    toast.add({
      severity: 'warn',
      summary: 'Falta categoria',
      detail: 'Selecciona una categoria antes de guardar el producto',
      life: 3000
    })
    return
  }

  const payload = {
    codigo_sku: product.value.codigo_sku?.trim() || null,
    nombre: product.value.nombre.trim(),
    descripcion: product.value.descripcion?.trim() || null,
    precio_compra: product.value.precio_compra ?? 0,
    precio_venta: product.value.precio_venta ?? 0,
    stock_actual: product.value.stock_actual ?? 0,
    stock_minimo: product.value.stock_minimo ?? 0,
    id_categoria: Number(product.value.id_categoria),
    id_proveedor: null
  }

  const res = await productosService.crear(payload)
  if (!res.success) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: res.error || 'No se pudo guardar en la base de datos',
      life: 3500
    })
    return
  }

  const nuevoProducto = mapDbProduct(res.data)
  productos.value.push(nuevoProducto)
  notifyLowStock(nuevoProducto)

  product.value = {
    codigo_sku: '',
    nombre: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 0,
    id_categoria: null,
    proveedor: ''
  }

  toast.add({ severity: 'success', summary: 'Registrado', detail: 'Producto guardado en la base de datos', life: 3000 })
}

const openMovement = (prod, tipo) => {
  selectedProduct.value = prod
  tipoMovimiento.value = tipo
  cantidadMovimiento.value = 0
  movementDialog.value = true
}

const applyMovement = () => {
  if (!selectedProduct.value) {
    return
  }

  const p = productos.value.find((x) => x.id === selectedProduct.value.id)
  if (!p) {
    return
  }

  if (tipoMovimiento.value === 'entrada') {
    p.stock_actual += cantidadMovimiento.value
  } else if (p.stock_actual >= cantidadMovimiento.value) {
    p.stock_actual -= cantidadMovimiento.value
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Stock insuficiente', life: 3000 })
    return
  }

  movementDialog.value = false
  notifyLowStock(p)
  toast.add({ severity: 'info', summary: 'Actualizado', detail: `Se registro una ${tipoMovimiento.value}`, life: 3000 })
}

const getStockSeverity = (stockActual, stockMinimo) => {
  if (stockActual <= 0) return 'danger'
  if (stockActual <= stockMinimo) return 'warning'
  return 'success'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value || 0)
}

onMounted(() => {
  loadInitialData()
})
</script>

<template>
  <div class="inventory-container">
    <Toast />

    <div class="inventory-header">
      <div class="header-content">
        <h1>Gestion de Inventario</h1>
        <p>Control de stock y movimientos</p>
      </div>
    </div>

    <Card class="custom-card mb-6">
      <template #title>
        <span class="card-title"><i class="pi pi-tags"></i> Crear Categoria</span>
      </template>
      <template #content>
        <div class="category-form-grid">
          <div class="field">
            <label>Nombre de la categoria</label>
            <InputText v-model="categoriaForm.nombre" placeholder="Ej. Electronica" />
          </div>
          <div class="field">
            <label>Descripcion</label>
            <InputText v-model="categoriaForm.descripcion" placeholder="Ej. Dispositivos y accesorios" />
          </div>
          <div class="field align-self-end">
            <Button label="Agregar categoria" icon="pi pi-plus" @click="saveCategory" class="p-button-sm" />
          </div>
        </div>
      </template>
    </Card>

    <Card class="custom-card mb-6">
      <template #title>
        <span class="card-title"><i class="pi pi-plus-circle"></i> Registrar Nuevo Producto</span>
      </template>
      <template #content>
        <div class="product-form-grid">
          <div class="field">
            <label>Codigo SKU</label>
            <InputText v-model="product.codigo_sku" placeholder="SKU-001" />
          </div>
          <div class="field">
            <label>Nombre</label>
            <InputText v-model="product.nombre" placeholder="Nombre del item" />
          </div>
          <div class="field">
            <label>Categoria</label>
            <Dropdown
              v-model="product.id_categoria"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona una categoria"
              :showClear="true"
            />
          </div>
          <div class="field">
            <label>Proveedor</label>
            <InputText v-model="product.proveedor" placeholder="Proveedor" />
          </div>
          <div class="field">
            <label>Precio Compra</label>
            <InputNumber v-model="product.precio_compra" :min="0" mode="currency" currency="CLP" locale="es-CL" />
          </div>
          <div class="field">
            <label>Precio Venta</label>
            <InputNumber v-model="product.precio_venta" :min="0" mode="currency" currency="CLP" locale="es-CL" />
          </div>
          <div class="field">
            <label>Stock Actual</label>
            <InputNumber v-model="product.stock_actual" :min="0" />
          </div>
          <div class="field">
            <label>Stock Minimo</label>
            <InputNumber v-model="product.stock_minimo" :min="0" />
          </div>
          <div class="field align-self-end">
            <Button label="Agregar al Inventario" icon="pi pi-plus" @click="saveProduct" class="p-button-sm" />
          </div>
        </div>
      </template>
    </Card>

    <div class="table-card">
      <div class="table-toolbar">
        <div class="field toolbar-filter">
          <label>Filtrar por categoria</label>
          <Dropdown
            v-model="selectedCategoryFilter"
            :options="categoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Todas las categorias"
            :showClear="true"
          />
        </div>
      </div>

      <DataTable :value="filteredProducts" responsiveLayout="scroll" class="p-datatable-minimal">
        <Column field="codigo_sku" header="Codigo"></Column>
        <Column field="nombre" header="Nombre del Producto"></Column>
        <Column field="descripcion" header="Descripcion"></Column>
        <Column header="Categoria">
          <template #body="slotProps">
            {{ getCategoryName(slotProps.data.id_categoria) }}
          </template>
        </Column>
        <Column field="proveedor" header="Proveedor"></Column>
        <Column field="precio_compra" header="Precio Compra">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.precio_compra) }}
          </template>
        </Column>
        <Column field="precio_venta" header="Precio Venta">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.precio_venta) }}
          </template>
        </Column>
        <Column field="stock_actual" header="Stock Actual">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.stock_actual"
              :severity="getStockSeverity(slotProps.data.stock_actual, slotProps.data.stock_minimo)"
            />
          </template>
        </Column>
        <Column field="stock_minimo" header="Stock Minimo"></Column>
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
  width: 100%;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.category-form-grid,
.product-form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem 1.25rem;
  align-items: end;
}

.align-self-end {
  align-self: end;
}

.table-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.table-toolbar {
  padding: 1rem 1rem 0.25rem;
}

.toolbar-filter {
  max-width: 320px;
}

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

@media (max-width: 960px) {
  .category-form-grid,
  .product-form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .category-form-grid,
  .product-form-grid {
    grid-template-columns: 1fr;
  }

  .toolbar-filter {
    max-width: 100%;
  }
}

:deep(#app) {
  width: 100% !important;
  max-width: 100% !important;
  border-inline: none !important;
}
</style>

<style>
.minimal-dialog.p-dialog {
  border: 1px solid #2e303a !important;
  border-radius: 10px !important;
  overflow: hidden !important;
}

.minimal-dialog .p-dialog-header {
  background: #1f2028 !important;
  color: #f3f4f6 !important;
  border-bottom: 1px solid #2e303a !important;
}

.minimal-dialog .p-dialog-header .p-dialog-title {
  color: #f3f4f6 !important;
}

.minimal-dialog .p-dialog-header .p-dialog-header-icon {
  color: #9ca3af !important;
}

.minimal-dialog .p-dialog-content,
.minimal-dialog .p-dialog-footer {
  background: #16171d !important;
  color: #e5e7eb !important;
}
</style>
