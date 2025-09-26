<template>
  <v-app>
    <!-- App Bar - Solo mostrar si está autenticado -->
    <v-app-bar v-if="authStore.isAuthenticated" color="primary" dark elevation="4" app>
      <v-app-bar-title>
        <v-btn to="/" variant="text" class="text-h6">
          <v-icon left>mdi-shopping</v-icon>
          Tienda Vue
        </v-btn>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Menú de navegación -->
      <div class="d-flex align-center">
        <v-btn to="/" variant="text" :class="{ 'v-btn--active': $route.name === 'home' }">
          <v-icon left>mdi-home</v-icon>
          <span class="d-none d-sm-inline">Inicio</span>
        </v-btn>

        <v-btn
          to="/productos"
          variant="text"
          :class="{
            'v-btn--active': $route.name === 'products' || $route.name === 'product-detail',
          }"
        >
          <v-icon left>mdi-shopping-outline</v-icon>
          <span class="d-none d-sm-inline">Productos</span>
        </v-btn>

        <v-btn
          to="/clientes"
          variant="text"
          :class="{ 'v-btn--active': $route.name === 'customers' }"
        >
          <v-icon left>mdi-account-group</v-icon>
          <span class="d-none d-sm-inline">Clientes</span>
        </v-btn>

        <!-- Menú de usuario -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" class="ml-2">
              <v-icon left>mdi-account-circle</v-icon>
              <span class="d-none d-md-inline">{{ authStore.userEmail }}</span>
              <v-icon right size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title class="text-caption text-grey">
                Conectado como:
              </v-list-item-title>
              <v-list-item-subtitle class="font-weight-medium">
                {{ authStore.user?.name || authStore.userEmail }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="handleLogout" :disabled="authStore.isLoading">
              <template v-slot:prepend>
                <v-icon color="error">mdi-logout</v-icon>
              </template>
              <v-list-item-title>Cerrar Sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main>
      <div v-if="authStore.isAuthenticated" class="main-content">
        <v-container fluid class="pa-6">
          <router-view />
        </v-container>
      </div>

      <!-- Vista de login (sin container) -->
      <div v-else>
        <router-view />
      </div>
    </v-main>

    <!-- Snackbar para notificaciones globales -->
    <v-snackbar v-model="showLogoutMessage" color="success" timeout="3000" location="top right">
      <v-icon left>mdi-check-circle</v-icon>
      Sesión cerrada correctamente
    </v-snackbar>

    <!-- Loading overlay global (opcional) -->
    <v-overlay
      v-if="authStore.isLoading && $route.name !== 'login'"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Stores y router
const authStore = useAuthStore()
const router = useRouter()

// Estado local
const showLogoutMessage = ref(false)

// Métodos
async function handleLogout() {
  try {
    await authStore.logout()
    showLogoutMessage.value = true
    await router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Lifecycle
onMounted(() => {
  // Restaurar sesión al iniciar la app
  authStore.restoreSession()
})
</script>

<style scoped>
.v-btn--active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.main-content {
  min-height: calc(100vh - 64px); /* Restar altura del app-bar */
}

/* Transiciones suaves */
.v-main {
  transition: all 0.3s ease;
}

.v-btn {
  transition: all 0.2s ease;
}

/* Responsive mejoras */
@media (max-width: 960px) {
  .v-container {
    padding: 16px !important;
  }
}

@media (max-width: 600px) {
  .v-app-bar-title {
    font-size: 1.1rem;
  }
}

/* Estados de hover mejorados */
.v-btn:hover:not(.v-btn--active) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Loading state */
.v-overlay {
  backdrop-filter: blur(2px);
}
</style>
