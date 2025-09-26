import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)

  const login = async (credentials) => {
    try {
      await authStore.login(credentials)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    try {
      await authStore.logout()
      await router.push('/login')
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const checkAuth = () => {
    return authStore.restoreSession()
  }

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,

    // Actions
    login,
    logout,
    checkAuth,

    // Utils
    clearError: authStore.clearError,
  }
}
