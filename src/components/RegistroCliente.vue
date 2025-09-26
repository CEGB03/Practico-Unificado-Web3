<template>
  <v-form ref="form" v-model="isFormValid" @submit.prevent="handleSubmit">
    <v-row>
      <!-- Campo Nombre -->
      <v-col cols="12" md="8">
        <v-text-field
          v-model="customerName"
          :rules="nameRules"
          label="Nombre del Cliente"
          placeholder="Ingresa el nombre del cliente..."
          prepend-inner-icon="mdi-account"
          variant="outlined"
          :disabled="isSubmitting"
          counter="50"
          maxlength="50"
          @input="clearMessages"
        ></v-text-field>
      </v-col>

      <!-- Botón Registrar -->
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          :loading="isSubmitting"
          color="primary"
          variant="elevated"
          size="large"
          block
        >
          <v-icon left>mdi-account-plus</v-icon>
          {{ isSubmitting ? 'Registrando...' : 'Registrar Cliente' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Mensajes de estado -->
    <v-row v-if="showMessage">
      <v-col cols="12">
        <v-alert :type="messageType" variant="tonal" closable @click:close="clearMessages">
          <template v-slot:prepend>
            <v-icon>
              {{ messageType === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>
          </template>
          {{ message }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Información adicional -->
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined" class="mt-4">
          <v-card-text class="pa-4">
            <div class="d-flex align-center mb-2">
              <v-icon class="me-2" color="info">mdi-information</v-icon>
              <span class="font-weight-bold text-body-1">Información sobre el registro</span>
            </div>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title class="text-body-2">
                  • El nombre debe tener al menos 3 caracteres
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-body-2">
                  • Se guardará la fecha y hora de registro automáticamente
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-body-2">
                  • Los clientes aparecerán en la lista de abajo inmediatamente
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ejemplos de nombres para testing -->
    <v-row v-if="!isSubmitting">
      <v-col cols="12">
        <v-card variant="outlined" color="grey-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center mb-2">
              <v-icon class="me-2" color="orange">mdi-lightning-bolt</v-icon>
              <span class="font-weight-bold text-body-2">Registro rápido para testing:</span>
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="exampleName in exampleNames"
                :key="exampleName"
                @click="fillExampleName(exampleName)"
                color="primary"
                variant="outlined"
                size="small"
                class="cursor-pointer"
              >
                {{ exampleName }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useCustomersStore } from '@/stores/customers'

// Store
const customersStore = useCustomersStore()

// Referencias del formulario
const form = ref(null)
const isFormValid = ref(false)
const isSubmitting = ref(false)

// Estado del formulario
const customerName = ref('')

// Estado de mensajes
const showMessage = ref(false)
const message = ref('')
const messageType = ref('success')

// Ejemplos para testing
const exampleNames = [
  'Juan Pérez',
  'María García',
  'Carlos López',
  'Ana Martínez',
  'Luis Rodríguez',
  'Carmen Sánchez',
]

// Reglas de validación
const nameRules = computed(() => [
  (v) => !!v || 'El nombre es requerido',
  (v) => (v && v.length >= 3) || 'El nombre debe tener al menos 3 caracteres',
  (v) => (v && v.length <= 50) || 'El nombre no puede exceder 50 caracteres',
  (v) => {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    return pattern.test(v) || 'El nombre solo debe contener letras y espacios'
  },
])

// Eventos
const emit = defineEmits(['customer-registered'])

// Métodos
async function handleSubmit() {
  // Validar formulario
  const { valid } = await form.value.validate()

  if (!valid) {
    showErrorMessage('Por favor, corrige los errores en el formulario')
    return
  }

  isSubmitting.value = true

  try {
    // Simular delay de guardado
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Validar que el nombre no esté vacío después del trim
    const trimmedName = customerName.value.trim()
    if (!trimmedName) {
      throw new Error('El nombre no puede estar vacío')
    }

    // Crear datos del cliente
    const customerData = {
      nombre: trimmedName,
      timestamp: Date.now(),
    }

    // Agregar cliente al store (con persistencia)
    const result = customersStore.addCustomer(customerData)

    if (!result.success) {
      throw new Error(result.error || 'Error al registrar el cliente')
    }

    // Emitir evento para compatibilidad con Customers.vue
    emit('customer-registered', result.customer)

    // Mostrar mensaje de éxito
    showSuccessMessage(`Cliente "${trimmedName}" registrado exitosamente`)

    // Limpiar formulario
    customerName.value = ''
    form.value.reset()

    console.log('Cliente registrado con persistencia:', result.customer)
  } catch (error) {
    console.error('Error al registrar cliente:', error)
    showErrorMessage(error.message || 'Error al registrar el cliente')
  } finally {
    isSubmitting.value = false
  }
}

function fillExampleName(name) {
  customerName.value = name
  clearMessages()
}

function showSuccessMessage(msg) {
  message.value = msg
  messageType.value = 'success'
  showMessage.value = true

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    showMessage.value = false
  }, 5000)
}

function showErrorMessage(msg) {
  message.value = msg
  messageType.value = 'error'
  showMessage.value = true
}

function clearMessages() {
  showMessage.value = false
  message.value = ''
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* Responsive mejoras */
@media (max-width: 600px) {
  .v-btn {
    margin-top: 8px;
  }
}
</style>
