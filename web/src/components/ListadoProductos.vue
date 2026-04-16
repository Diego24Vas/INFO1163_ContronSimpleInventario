<template>
  <div class="listado-productos">
    <div v-if="productos.length === 0" class="empty-state">
      <p>No hay productos registrados</p>
    </div>

    <div v-else class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Producto</th>
            <th>Categoria</th>
            <th>Proveedor</th>
            <th>Stock</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id_producto" class="fila">
            <td>{{ producto.codigo_sku || '-' }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ getNombreCategoria(producto.id_categoria) }}</td>
            <td>{{ getNombreProveedor(producto.id_proveedor) }}</td>
            <td>
              <span :class="['stock-pill', { bajo: producto.stock_actual <= producto.stock_minimo }]">
                {{ producto.stock_actual }} / min {{ producto.stock_minimo }}
              </span>
            </td>
            <td>{{ formatPrice(producto.precio_compra) }}</td>
            <td>{{ formatPrice(producto.precio_venta) }}</td>
            <td class="acciones">
              <button @click="emit('movimiento', { producto, tipo: 'entrada' })" class="btn-accion btn-entrada" title="Entrada">+</button>
              <button @click="emit('movimiento', { producto, tipo: 'salida' })" class="btn-accion btn-salida" title="Salida">-</button>
              <button @click="emit('editar', producto)" class="btn-accion btn-editar" title="Editar">✎</button>
              <button @click="emit('eliminar', producto.id_producto)" class="btn-accion btn-eliminar" title="Eliminar">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
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

const emit = defineEmits(['editar', 'eliminar', 'movimiento'])

const getNombreCategoria = (idCategoria) => {
  const categoria = props.categorias.find(item => item.id_categoria === idCategoria)
  return categoria?.nombre || '-'
}

const getNombreProveedor = (idProveedor) => {
  const proveedor = props.proveedores.find(item => item.id_proveedor === idProveedor)
  return proveedor?.nombre_empresa || '-'
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value || 0)
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
}

.tabla-container {
  overflow-x: auto;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
}

.tabla thead {
  background: var(--bg-tertiary);
  border-bottom: 2px solid var(--border-light);
}

.tabla th,
.tabla td {
  padding: var(--spacing-md);
  text-align: left;
}

.tabla th {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--text-primary);
}

.tabla td {
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
}

.fila:hover {
  background-color: var(--bg-tertiary);
}

.acciones {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-accion {
  border: none;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: bold;
}

.btn-entrada {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
}

.btn-salida {
  background: rgba(239, 68, 68, 0.2);
  color: var(--error);
}

.btn-editar {
  background: rgba(6, 182, 212, 0.2);
  color: var(--info);
}

.btn-eliminar {
  background: rgba(239, 68, 68, 0.12);
  color: var(--error);
}

.stock-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.18);
  color: var(--success);
  font-size: 0.82rem;
}

.stock-pill.bajo {
  background: rgba(245, 158, 11, 0.2);
  color: var(--warning);
}
</style>