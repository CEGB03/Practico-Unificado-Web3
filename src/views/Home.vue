<template>
  <div class="home-page">
    <!-- Hero Section -->
    <v-card class="hero-section mb-8" color="primary" variant="flat">
      <v-card-text class="text-center pa-8 text-white">
        <v-icon size="80" class="mb-4">mdi-shopping</v-icon>
        <h1 class="text-h3 font-weight-bold mb-4">¡Bienvenido a Tienda Vue!</h1>
        <p class="text-h6 mb-6">La mejor experiencia de compra online con Vue 3 y Vuetify</p>
        <v-btn to="/productos" size="large" color="white" variant="elevated" class="text-primary">
          <v-icon left>mdi-shopping-outline</v-icon>
          Explorar Productos
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Stats Cards -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="2">
          <v-card-text class="pa-6">
            <v-icon size="48" color="primary" class="mb-3">mdi-package-variant</v-icon>
            <div class="text-h4 font-weight-bold text-primary">
              {{ productsStore.products.length }}
            </div>
            <div class="text-body-1">Productos Disponibles</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="2">
          <v-card-text class="pa-6">
            <v-icon size="48" color="success" class="mb-3">mdi-cart</v-icon>
            <div class="text-h4 font-weight-bold text-success">{{ cartStore.totalItems }}</div>
            <div class="text-body-1">Artículos en Carrito</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="2">
          <v-card-text class="pa-6">
            <v-icon size="48" color="warning" class="mb-3">mdi-currency-usd</v-icon>
            <div class="text-h4 font-weight-bold text-warning">
              ${{ cartStore.totalAmount.toFixed(2) }}
            </div>
            <div class="text-body-1">Total Carrito</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="2">
          <v-card-text class="pa-6">
            <v-icon size="48" color="info" class="mb-3">mdi-account</v-icon>
            <div class="text-h4 font-weight-bold text-info">1</div>
            <div class="text-body-1">Usuario Conectado</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100">
          <v-card-title class="d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-lightning-bolt</v-icon>
            Acciones Rápidas
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item to="/productos" prepend-icon="mdi-shopping-outline">
                <v-list-item-title>Ver Todos los Productos</v-list-item-title>
                <v-list-item-subtitle>Explora nuestro catálogo completo</v-list-item-subtitle>
              </v-list-item>

              <v-list-item to="/clientes" prepend-icon="mdi-account-group">
                <v-list-item-title>Gestionar Clientes</v-list-item-title>
                <v-list-item-subtitle>Administra la información de clientes</v-list-item-subtitle>
              </v-list-item>

              <v-list-item
                @click="clearCart"
                prepend-icon="mdi-cart-remove"
                :disabled="cartStore.isEmpty"
              >
                <v-list-item-title>Limpiar Carrito</v-list-item-title>
                <v-list-item-subtitle>Vacía el carrito de compras</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100">
          <v-card-title class="d-flex align-center">
            <v-icon class="me-2" color="success">mdi-information</v-icon>
            Información del Sistema
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Usuario:</v-list-item-title>
                <v-list-item-subtitle>{{
                  authStore.user?.name || authStore.userEmail
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Sesión iniciada:</v-list-item-title>
                <v-list-item-subtitle>{{
                  formatDate(authStore.user?.loginTime)
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Framework:</v-list-item-title>
                <v-list-item-subtitle>Vue 3 + Vuetify 3 + Pinia</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Estado:</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip color="success" size="small" variant="flat">
                    <v-icon left size="small">mdi-check-circle</v-icon>
                    Sistema Operativo
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'

// Stores
const authStore = useAuthStore()
const cartStore = useCartStore()
const productsStore = useProductsStore()

// Methods
function clearCart() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cartStore.clearCart()
  }
}

function formatDate(dateString) {
  if (!dateString) return 'No disponible'

  try {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .hero-section .text-h3 {
    font-size: 2rem !important;
  }

  .hero-section .text-h6 {
    font-size: 1.1rem !important;
  }
}
</style>
