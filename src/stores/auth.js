import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')

  // Mock de usuarios válidos (simular backend)
  const validUsers = [
    { email: 'admin@test.com', password: '123456', name: 'Administrador' },
    { email: 'user@test.com', password: 'password', name: 'Usuario Test' },
    { email: 'demo@test.com', password: '123456', name: 'Usuario Demo' },
  ]

  // Actions
  async function login(credentials) {
    isLoading.value = true
    error.value = null

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validar credenciales
      const foundUser = validUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password,
      )

      if (!foundUser) {
        throw new Error('Credenciales inválidas. Verifica tu email y contraseña.')
      }

      // Crear sesión
      const userSession = {
        id: Date.now(),
        email: foundUser.email,
        name: foundUser.name,
        loginTime: new Date().toISOString(),
      }

      user.value = userSession

      // Persistir en localStorage
      localStorage.setItem('auth_user', JSON.stringify(userSession))
      localStorage.setItem('auth_token', `token_${userSession.id}`)

      // Inicializar stores relacionados después del login
      setTimeout(async () => {
        const { useCartStore } = await import('./cart')

        const cartStore = useCartStore()

        cartStore.loadCart()
      }, 0)

      return { success: true, user: userSession }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Limpiar estado
      user.value = null
      error.value = null

      // Limpiar localStorage de auth
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')

      // Limpiar stores relacionados
      const { useCartStore } = await import('./cart')

      const cartStore = useCartStore()

      cartStore.clearCart()

      return { success: true }
    } finally {
      isLoading.value = false
    }
  }

  function restoreSession() {
    try {
      const savedUser = localStorage.getItem('auth_user')
      const savedToken = localStorage.getItem('auth_token')

      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser)

        // Verificar que la sesión no sea muy antigua (opcional)
        const loginTime = new Date(userData.loginTime)
        const now = new Date()
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60)

        if (hoursDiff < 24) {
          // Sesión válida por 24 horas
          user.value = userData

          // Inicializar stores relacionados
          setTimeout(async () => {
            const { useCartStore } = await import('./cart')

            const cartStore = useCartStore()

            cartStore.loadCart()
          }, 0)

          return true
        } else {
          // Limpiar sesión expirada
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_token')
        }
      }
    } catch (err) {
      console.error('Error al restaurar sesión:', err)
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    }
    return false
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    userEmail,
    login,
    logout,
    restoreSession,
    clearError,
  }
})
