<template>
  <v-container class="login-container fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card
          class="login-card elevation-12"
          rounded="xl"
          :loading="authStore.isLoading"
        >
          <!-- Header del formulario -->
          <v-card-title class="text-center pa-6 pb-4">
            <div class="login-header">
              <v-icon size="48" color="primary" class="mb-4">mdi-account-circle</v-icon>
              <h1 class="text-h4 font-weight-bold text-primary">Iniciar Sesión</h1>
              <p class="text-body-1 text-grey mt-2">Ingresa tus credenciales para continuar</p>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Formulario -->
          <v-card-text class="pa-6">
            <v-form ref="loginForm" v-model="isFormValid" @submit.prevent="handleLogin">
              <!-- Campo Email -->
              <v-text-field
                v-model="credentials.email"
                :rules="emailRules"
                :error-messages="emailError"
                label="Correo electrónico"
                placeholder="ejemplo@correo.com"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                class="mb-4"
                :disabled="authStore.isLoading"
                autocomplete="email"
                aria-label="Correo electrónico"
                @input="clearFieldError('email')"
                @blur="validateEmail"
              ></v-text-field>

              <!-- Campo Contraseña -->
              <v-text-field
                v-model="credentials.password"
                :rules="passwordRules"
                :error-messages="passwordError"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                variant="outlined"
                class="mb-4"
                :disabled="authStore.isLoading"
                autocomplete="current-password"
                aria-label="Contraseña"
                @click:append-inner="showPassword = !showPassword"
                @input="clearFieldError('password')"
                @blur="validatePassword"
              ></v-text-field>

              <!-- Error general del login -->
              <v-alert
                v-if="authStore.error"
                type="error"
                variant="tonal"
                closable
                class="mb-4"
                @click:close="authStore.clearError"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-alert-circle</v-icon>
                </template>
                {{ authStore.error }}
              </v-alert>

              <!-- Información de usuarios demo -->
              <v-expansion-panels v-if="!authStore.isLoading" class="mb-4" variant="accordion">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon class="me-2">mdi-information</v-icon>
                    Usuarios de prueba
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title class="text-caption">admin@test.com / 123456</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="text-caption">user@test.com / password</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="text-caption">demo@test.com / 123456</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Botón de login -->
              <v-btn
                type="submit"
                :disabled="!isFormValid || authStore.isLoading"
                :loading="authStore.isLoading"
                color="primary"
                size="large"
                variant="elevated"
                block
                class="mb-4"
                aria-label="Iniciar sesión"
              >
                <v-icon left>mdi-login</v-icon>
                {{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Stores y router
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Referencias del formulario
const loginForm = ref(null)
const isFormValid = ref(false)
const showPassword = ref(false)

// Estado del formulario
const credentials = reactive({
  email: '',
  password: ''
})

// Errores específicos de campos
const emailError = ref('')
const passwordError = ref('')

// Reglas de validación
const emailRules = computed(() => [
  (v) => !!v || 'El correo electrónico es requerido',
  (v) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Debe ser un correo electrónico válido'
  }
])

const passwordRules = computed(() => [
  (v) => !!v || 'La contraseña es requerida',
  (v) => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
])

// Métodos de validación
function validateEmail() {
  const emailRule = emailRules.value
  for (const rule of emailRule) {
    const result = rule(credentials.email)
    if (result !== true) {
      emailError.value = result
      return false
    }
  }
  emailError.value = ''
  return true
}

function validatePassword() {
  const passwordRule = passwordRules.value
  for (const rule of passwordRule) {
    const result = rule(credentials.password)
    if (result !== true) {
      passwordError.value = result
      return false
    }
  }
  passwordError.value = ''
  return true
}

function clearFieldError(field) {
  if (field === 'email') emailError.value = ''
  if (field === 'password') passwordError.value = ''
  authStore.clearError()
}

// Manejo del login
async function handleLogin() {
  // Validar formulario completo
  const { valid } = await loginForm.value.validate()
  
  if (!valid) {
    return
  }

  try {
    await authStore.login(credentials)
    
    // Redireccionar después del login exitoso
    const redirectTo = route.query.redirect || '/'
    await router.push(redirectTo)
    
  } catch (error) {
    // El error ya está manejado en el store
    console.error('Error en login:', error)
  }
}

// Auto-rellenar para desarrollo (opcional)
function fillDemoCredentials(type = 'admin') {
  switch (type) {
    case 'admin':
      credentials.email = 'admin@test.com'
      credentials.password = '123456'
      break
    case 'user':
      credentials.email = 'user@test.com'
      credentials.password = 'password'
      break
    case 'demo':
      credentials.email = 'demo@test.com'
      credentials.password = '123456'
      break
  }
}

onMounted(() => {
  // Limpiar errores al montar el componente
  authStore.clearError()
  
  // Si ya está autenticado, redireccionar
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-card {
  max-width: 100%;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.login-header {
  text-align: center;
}

/* Animaciones suaves */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn {
  transition: all 0.2s ease;
}

.v-text-field {
  transition: all 0.2s ease;
}

/* Estados de hover y focus mejorados */
.v-text-field:hover {
  transform: translateY(-1px);
}

.v-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 600px) {
  .login-card {
    margin: 16px;
  }
  
  .login-header h1 {
    font-size: 1.8rem;
  }
}

/* Estados de carga */
.v-card--loading {
  pointer-events: none;
}

.v-card--loading::before {
  opacity: 0.1;
}
</style>