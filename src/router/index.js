import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Products from '@/views/Products.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import Customers from '@/views/Customers.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/productos',
      name: 'products',
      component: Products
    },
    {
      path: '/productos/:id',
      name: 'product-detail',
      component: ProductDetail,
      props: true
    },
    {
      path: '/clientes',
      name: 'customers',
      component: Customers
    },
    // Ruta 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Restaurar scroll al navegar
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
