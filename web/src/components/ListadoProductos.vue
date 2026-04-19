<template>
  <div class="listado-productos">
    <div v-if="productos.length === 0" class="empty-state">
      <p>No hay productos registrados</p>
    </div>

    <div v-else class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th class="col-sku">SKU</th>
            <th class="col-nombre">Producto</th>
            <th class="col-categoria">Categoría</th>
            <th class="col-proveedor">Proveedor</th>
            <th class="col-stock">Stock</th>
            <th class="col-precios">Precio Compra</th>
            <th class="col-precios">Precio Venta</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id_producto" class="fila" :class="{ 'stock-critico': producto.stock_actual <= producto.stock_minimo }">
            <td class="col-sku"><span class="sku-badge">{{ producto.codigo_sku || '-' }}</span></td>
            <td class="col-nombre">
              <div class="nombre-producto">{{ producto.nombre }}</div>
            </td>
            <td class="col-categoria"><span class="categoria-badge">{{ getNombreCategoria(producto.id_categoria) }}</span></td>
            <td class="col-proveedor">{{ getNombreProveedor(producto.id_proveedor) }}</td>
            <td class="col-stock">
              <div class="stock-container">
                <span v-if="producto.stock_actual === 0" class="stock-badge sin-stock">
                  Sin stock
                </span>
                <span v-else :class="['stock-badge', { crítico: producto.stock_actual <= producto.stock_minimo }]">
                  {{ producto.stock_actual }}
                </span>
                <span class="stock-minimo">mín: {{ producto.stock_minimo }}</span>
              </div>
            </td>
            <td class="col-precios">{{ formatPrice(producto.precio_compra) }}</td>
            <td class="col-precios">{{ formatPrice(producto.precio_venta) }}</td>
            <td class="col-acciones">
              <div class="acciones-grupo">
                <button @click="emit('movimiento', { producto, tipo: 'entrada' })" class="btn-accion btn-entrada" title="Registrar entrada" aria-label="Entrada de stock">
                  +
                </button>
                <button @click="emit('movimiento', { producto, tipo: 'salida' })" class="btn-accion btn-salida" title="Registrar salida" aria-label="Salida de stock">
                  -
                </button>
                <button @click="emit('editar', producto)" class="btn-accion btn-editar" title="Editar producto" aria-label="Editar">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button @click="emit('eliminar', producto.id_producto)" class="btn-accion btn-eliminar" title="Eliminar producto" aria-label="Eliminar">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
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
  padding: var(--spacing-3xl) var(--spacing-2xl);
  color: var(--text-muted);
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
  color: var(--text-muted);
}


.tabla-container {
  overflow-x: auto;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  background: var(--bg-secondary);
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
}

.tabla thead {
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
  border-bottom: 2px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabla th {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}

.tabla td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
}

.fila {
  transition: background-color var(--transition-fast);
}

.fila:hover {
  background-color: rgba(59, 130, 246, 0.04);
}

.fila.stock-critico:hover {
  background-color: rgba(245, 158, 11, 0.06);
}

/* Columnas específicas */
.col-sku,
.col-stock,
.col-precios,
.col-acciones {
  width: auto;
}

.col-nombre {
  min-width: 180px;
}

.col-categoria,
.col-proveedor {
  min-width: 130px;
}

/* SKU Badge */
.sku-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(6, 182, 212, 0.1);
  color: var(--info);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.nombre-producto {
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}

.categoria-badge {
  display: inline-block;
  padding: 4px 10px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 500;
}

/* Stock container */
.stock-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stock-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.stock-badge.crítico {
  background: rgba(245, 158, 11, 0.2);
  color: var(--warning);
}

.stock-badge.sin-stock {
  background: rgba(239, 68, 68, 0.2);
  color: var(--error);
  font-weight: 700;
}

.stock-minimo {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
}

/* Acciones */
.acciones-grupo {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.btn-accion {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.btn-entrada {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.btn-entrada:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: var(--success);
}

.btn-salida {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-salida:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: var(--error);
}

.btn-editar {
  background: rgba(6, 182, 212, 0.15);
  color: var(--info);
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.btn-editar:hover {
  background: rgba(6, 182, 212, 0.25);
  border-color: var(--info);
}

.btn-eliminar {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-eliminar:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Responsive */
@media (max-width: 1280px) {
  .tabla th,
  .tabla td {
    padding: var(--spacing-md) var(--spacing-md);
  }

  .col-nombre {
    min-width: 140px;
  }
}

@media (max-width: 768px) {
  .tabla th,
  .tabla td {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.9rem;
  }

  .tabla th {
    font-size: 0.75rem;
  }

  .btn-accion {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }

  .col-categoria,
  .col-proveedor {
    min-width: 100px;
  }

  .col-nombre {
    min-width: 120px;
  }

  .acciones-grupo {
    gap: 4px;
  }

  .stock-minimo {
    display: none;
  }
}

@media (max-width: 640px) {
  .tabla-container {
    border-radius: var(--radius-md);
  }

  .tabla th {
    font-size: 0.7rem;
    padding: var(--spacing-sm);
    letter-spacing: 0;
  }

  .tabla td {
    padding: var(--spacing-sm);
  }

  .btn-accion {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .sku-badge,
  .categoria-badge {
    font-size: 0.75rem;
    padding: 3px 6px;
  }

  .nombre-producto {
    font-size: 0.9rem;
  }
}
</style>