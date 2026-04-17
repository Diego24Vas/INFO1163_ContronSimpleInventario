<template>
  <aside class="sidebar">
    <!-- Menu Section -->
    <nav class="menu">
      <div class="menu-section">
        <h3 class="menu-title">Menu</h3>
        <ul class="menu-list">
          <li>
            <router-link
              to="/"
              class="menu-item"
              :class="{ active: activeMenu === 'home' }"
              @click="setActive('home')"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Inicio</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/historial"
              class="menu-item"
              :class="{ active: activeMenu === 'historial' }"
              @click="setActive('historial')"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-11h2V17z"/>
              </svg>
              <span>Historial</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/productos"
              class="menu-item"
              :class="{ active: activeMenu === 'productos' }"
              @click="setActive('productos')"
            >
              <i class="icon fa-solid fa-box"></i>
              <span>Productos</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/categorias"
              class="menu-item"
              :class="{ active: activeMenu === 'categorias' }"
              @click="setActive('categorias')"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
              <span>Categorías</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/proveedores"
              class="menu-item"
              :class="{ active: activeMenu === 'proveedores' }"
              @click="setActive('proveedores')"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Proveedores</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref('home')

// Actualizar el menú activo según la ruta actual
const updateActiveMenu = () => {
  const path = route.path
  
  if (path === '/') {
    activeMenu.value = 'home'
  } else if (path === '/productos') {
    activeMenu.value = 'productos'
  } else if (path === '/categorias') {
    activeMenu.value = 'categorias'
  } else if (path === '/historial') {
    activeMenu.value = 'historial'
  } else if (path === '/proveedores') {
    activeMenu.value = 'proveedores'
  }
}

// Ejecutar al montar y cuando cambié la ruta
watch(() => route.path, updateActiveMenu, { immediate: true })

const setActive = (menu) => {
  activeMenu.value = menu
}

defineEmits(['search'])
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 8px 0 24px rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  border-right: 1px solid var(--border-light);
}

/* Menu Section */
.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-title {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0;
  padding: 0 0.5rem;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-tertiary);
  z-index: -1;
}

.menu-item:hover {
  color: var(--text-primary);
}

.menu-item:hover::before {
  left: 0;
}

.menu-item.active {
  background-color: var(--primary);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.menu-item.active::before {
  left: 0;
  background: var(--primary-dark);
}

.icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: inherit;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: var(--radius-sm);
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 250px;
    padding: 1rem;
  }

  .menu-item {
    padding: 0.75rem 0.75rem;
    gap: 0.75rem;
    font-size: 0.9rem;
  }

  .icon {
    width: 20px;
    height: 20px;
  }
}
</style>
