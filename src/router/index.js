import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar vistas
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Customers from '../views/Customers.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true, // Solo accesible si NO está autenticado
      title: 'Iniciar Sesión',
    },
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
      title: 'Inicio',
    },
  },
  {
    path: '/productos',
    name: 'products',
    component: Products,
    meta: {
      requiresAuth: true,
      title: 'Productos',
    },
  },
  {
    path: '/productos/:id',
    name: 'product-detail',
    component: ProductDetail,
    meta: {
      requiresAuth: true,
      title: 'Detalle del Producto',
    },
  },
  {
    path: '/clientes',
    name: 'customers',
    component: Customers,
    meta: {
      requiresAuth: true,
      title: 'Clientes',
    },
  },
  // Ruta catch-all para 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Guardia global ANTES de cada navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Intentar restaurar sesión si no está cargada
  if (!authStore.isAuthenticated && !authStore.user) {
    authStore.restoreSession()
  }

  // Verificar rutas que requieren autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Guardar la ruta a la que quería acceder para redireccionar después del login
    return next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }

  // Verificar rutas solo para invitados (como login)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/')
  }

  // Actualizar título de la página
  if (to.meta.title) {
    document.title = `${to.meta.title} - Tienda Vue`
  }

  next()
})

// Guardia global DESPUÉS de cada navegación
router.afterEach((to, from) => {
  // Aquí se pueden agregar analytics, logs, etc.
  console.log(`Navegando de ${from.path} a ${to.path}`)
})

export default router
