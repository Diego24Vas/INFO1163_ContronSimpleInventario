import { createRouter, createWebHistory } from 'vue-router';

// Importar las vistas
import home from '../views/home.vue';
import Error404 from '../views/404.vue';
import productos from '../views/productos.vue';
import proveedores from '../views/proveedores.vue'
import categorias from '../views/categorias.vue';
import historial from '../views/historial.vue';

// Definir las rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: home,
  },
  {
    path: '/productos',
    name: 'Productos',
    component: productos,
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: categorias,
  },
  {
    path: '/historial',
    name: 'Historial',
    component: historial,
  },
  {
    path: '/proveedores',
    name: 'Proveedores',
    component: proveedores,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error404',
    component: Error404,
  },
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;