<template>
  <div class="customers-page">
    <!-- Header -->
    <div class="page-header mb-6">
      <h1 class="text-h3 font-weight-bold mb-2">👥 Gestión de Clientes</h1>
      <p class="text-body-1">Administra la información de tus clientes</p>
    </div>

    <!-- Registro de Cliente -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="me-2" color="primary">mdi-account-plus</v-icon>
        Registrar Nuevo Cliente
      </v-card-title>
      <v-card-text>
        <RegistroCliente @customer-registered="handleCustomerRegistered" />
      </v-card-text>
    </v-card>

    <!-- Lista de Clientes -->
    <v-card elevation="2">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon class="me-2" color="primary">mdi-account-group</v-icon>
          Clientes Registrados
        </div>
        <div class="d-flex align-center ga-2">
          <v-chip color="primary" variant="flat">
            {{ customers.length }} {{ customers.length === 1 ? 'cliente' : 'clientes' }}
          </v-chip>
          <v-btn
            v-if="customers.length > 0"
            @click="clearAllCustomers"
            color="error"
            variant="outlined"
            size="small"
            prepend-icon="mdi-delete-sweep"
          >
            Limpiar Todo
          </v-btn>
        </div>
      </v-card-title>

      <!-- Estado vacío -->
      <v-card-text v-if="customers.length === 0" class="text-center pa-8">
        <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-account-group-outline</v-icon>
        <h3 class="text-h6 mb-2">No hay clientes registrados</h3>
        <p class="text-body-2">Registra el primer cliente usando el formulario de arriba</p>
      </v-card-text>

      <!-- Lista de clientes -->
      <div v-else>
        <v-list>
          <v-list-item v-for="(customer, index) in customers" :key="customer.id" class="px-4 py-3">
            <template v-slot:prepend>
              <v-avatar color="primary" class="text-white">
                {{ getInitials(customer.nombre) }}
              </v-avatar>
            </template>

            <v-list-item-title class="text-subtitle-1 font-weight-medium">
              {{ customer.nombre }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption">
              Registrado: {{ formatDate(customer.fechaRegistro) }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="d-flex align-center gap-2">
                <v-chip color="success" size="small" variant="outlined">
                  Cliente #{{ customer.id }}
                </v-chip>

                <v-btn
                  @click="removeCustomer(customer.id)"
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  size="small"
                  density="compact"
                ></v-btn>
              </div>
            </template>

            <v-divider v-if="index < customers.length - 1"></v-divider>
          </v-list-item>
        </v-list>

        <!-- Acciones masivas -->
        <v-divider></v-divider>
        <v-card-actions class="px-4 py-3">
          <v-spacer></v-spacer>
          <v-btn
            @click="clearAllCustomers"
            color="error"
            variant="outlined"
            :disabled="customers.length === 0"
          >
            <v-icon left>mdi-delete-sweep</v-icon>
            Limpiar Lista
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <!-- Estadísticas -->
    <v-row class="mt-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="1">
          <v-card-text class="pa-4">
            <v-icon size="40" color="primary" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h5 font-weight-bold">{{ customers.length }}</div>
            <div class="text-body-2">Total Clientes</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="1">
          <v-card-text class="pa-4">
            <v-icon size="40" color="success" class="mb-2">mdi-calendar-today</v-icon>
            <div class="text-h5 font-weight-bold">{{ todayRegistrations }}</div>
            <div class="text-body-2">Registros Hoy</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="1">
          <v-card-text class="pa-4">
            <v-icon size="40" color="info" class="mb-2">mdi-chart-line</v-icon>
            <div class="text-h5 font-weight-bold">{{ averageLength }}</div>
            <div class="text-body-2">Promedio Nombre</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center" elevation="1">
          <v-card-text class="pa-4">
            <v-icon size="40" color="warning" class="mb-2">mdi-clock</v-icon>
            <div class="text-h5 font-weight-bold">{{ lastRegistrationTime }}</div>
            <div class="text-body-2">Último Registro</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar de confirmación -->
    <v-snackbar v-model="showSuccessMessage" color="success" timeout="3000" location="top right">
      <v-icon left>mdi-check-circle</v-icon>
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCustomersStore } from '@/stores/customers'
import RegistroCliente from '@/components/RegistroCliente.vue'

// Store
const customersStore = useCustomersStore()

// Estado local
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Usar los datos del store en lugar del estado local
const customers = computed(() => customersStore.customers)

// Computed properties usando el store
const todayRegistrations = computed(() => customersStore.customersToday)

const averageLength = computed(() => {
  if (customers.value.length === 0) return 0
  const totalLength = customers.value.reduce((sum, customer) => sum + customer.nombre.length, 0)
  return Math.round(totalLength / customers.value.length)
})

const lastRegistrationTime = computed(() => customersStore.lastRegistration)

// Methods
function handleCustomerRegistered(customerData) {
  // El registro ya se manejó en el store por RegistroCliente.vue
  // Solo mostrar mensaje de confirmación
  showMessage(`Cliente "${customerData.nombre}" registrado exitosamente`)
}

function removeCustomer(customerId) {
  const customer = customersStore.getCustomerById(customerId)
  if (customer && confirm(`¿Estás seguro de que quieres eliminar a "${customer.nombre}"?`)) {
    const result = customersStore.removeCustomer(customerId)
    if (result.success) {
      showMessage(`Cliente "${customer.nombre}" eliminado`)
    } else {
      showMessage(`Error al eliminar cliente: ${result.error}`)
    }
  }
}

function clearAllCustomers() {
  if (customers.value.length === 0) {
    showMessage('No hay clientes para eliminar')
    return
  }

  if (confirm('¿Estás seguro de que quieres eliminar todos los clientes?')) {
    const result = customersStore.clearAllCustomers()
    if (result.success) {
      showMessage('Lista de clientes limpiada')
    } else {
      showMessage(`Error al limpiar clientes: ${result.error}`)
    }
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}

function formatTimeAgo(dateString) {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `${diffInMinutes}m`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d`
  } catch (error) {
    return 'N/A'
  }
}

function showMessage(message) {
  successMessage.value = message
  showSuccessMessage.value = true
}

// Lifecycle
onMounted(() => {
  // Cargar clientes del localStorage cuando se monta el componente
  customersStore.loadCustomers()
})
</script>

<style scoped>
.customers-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
}

.gap-2 {
  gap: 8px;
}

/* Responsive */
@media (max-width: 600px) {
  .page-header h1 {
    font-size: 2rem !important;
  }
}
</style>
