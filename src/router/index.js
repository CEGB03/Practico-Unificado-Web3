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
    // Si hay una posición guardada (botón atrás/adelante)
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition)
        }, 300) // Esperar a que se cargue el contenido
      })
    }

    // Si hay un hash, scroll al elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80, // Offset para el header fijo
      }
    }

    // Para navegación a detalle y vuelta a lista, mantener posición
    if (from.name === 'product-detail' && to.name === 'products') {
      const savedScroll = sessionStorage.getItem('products_scroll')
      if (savedScroll) {
        const { x, y } = JSON.parse(savedScroll)
        return { left: x, top: y, behavior: 'smooth' }
      }
    }

    // Por defecto, scroll al top
    return { top: 0, behavior: 'smooth' }
  },
})

// Guardar posición antes de navegar a detalle
router.beforeEach((to, from, next) => {
  // Guardar scroll de productos antes de ir a detalle
  if (from.name === 'products' && to.name === 'product-detail') {
    sessionStorage.setItem(
      'products_scroll',
      JSON.stringify({
        x: window.scrollX,
        y: window.scrollY,
      }),
    )
  }

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
