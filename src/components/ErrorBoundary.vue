<template>
  <div v-if="hasError" class="error-boundary">
    <v-card class="error-card" elevation="8">
      <v-card-text class="text-center pa-8">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
        <h2 class="text-h4 mb-4">¡Oops! Algo salió mal</h2>
        <p class="text-body-1 mb-6">{{ errorMessage }}</p>

        <div class="error-actions">
          <v-btn color="primary" @click="retry" class="me-4">
            <v-icon left>mdi-refresh</v-icon>
            Reintentar
          </v-btn>

          <v-btn color="secondary" variant="outlined" @click="goHome">
            <v-icon left>mdi-home</v-icon>
            Ir al Inicio
          </v-btn>
        </div>

        <v-expansion-panels v-if="showDetails" class="mt-6" variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>Detalles del Error</v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="error-details">{{ errorDetails }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>

  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const showDetails = ref(false)

const props = defineProps({
  fallback: {
    type: String,
    default: 'Ha ocurrido un error inesperado',
  },
})

const emit = defineEmits(['error'])

onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message || props.fallback
  errorDetails.value = `Error: ${error.stack}\nInfo: ${info}`

  emit('error', { error, instance, info })

  console.error('Error capturado por ErrorBoundary:', error)
  return false
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-card {
  max-width: 600px;
  width: 100%;
}

.error-details {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
  overflow-x: auto;
}

.error-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 600px) {
  .error-actions {
    flex-direction: column;
  }

  .error-actions .v-btn {
    width: 100%;
  }
}
</style>
