import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useCustomersStore = defineStore('customers', () => {
  // Estado
  const customers = ref([])
  const lastCustomerId = ref(0)

  // Computed para estadísticas
  const totalCustomers = computed(() => customers.value.length)

  const customersToday = computed(() => {
    const today = new Date().toDateString()
    return customers.value.filter((customer) => {
      const customerDate = new Date(customer.timestamp).toDateString()
      return customerDate === today
    }).length
  })

  const newestCustomer = computed(() => {
    if (customers.value.length === 0) return null
    return customers.value.reduce((newest, current) =>
      current.timestamp > newest.timestamp ? current : newest,
    )
  })

  const lastRegistration = computed(() => {
    if (!newestCustomer.value) return 'N/A'

    const now = Date.now()
    const diff = now - newestCustomer.value.timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'hace un momento'
  })

  // Función para obtener la clave de localStorage específica del usuario
  function getStorageKey() {
    const authStore = useAuthStore()
    const userId = authStore.user?.id || 'guest'
    return `customers_${userId}`
  }

  // Función para cargar los clientes desde localStorage
  function loadCustomers() {
    try {
      const storageKey = getStorageKey()
      const stored = localStorage.getItem(storageKey)

      if (stored) {
        const parsedData = JSON.parse(stored)
        customers.value = parsedData.customers || []
        lastCustomerId.value = parsedData.lastCustomerId || 0

        console.log(
          `Clientes cargados desde localStorage para usuario ${getStorageKey()}:`,
          customers.value,
        )
      } else {
        // Inicializar con datos por defecto si no hay datos guardados
        customers.value = []
        lastCustomerId.value = 0
        console.log('No se encontraron clientes en localStorage, iniciando con lista vacía')
      }
    } catch (error) {
      console.error('Error al cargar clientes desde localStorage:', error)
      customers.value = []
      lastCustomerId.value = 0
    }
  }

  // Función para guardar los clientes en localStorage
  function saveCustomers() {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        console.log('No hay usuario autenticado, no se guardan clientes')
        return
      }

      const storageKey = getStorageKey()
      const dataToSave = {
        customers: customers.value,
        lastCustomerId: lastCustomerId.value,
        timestamp: Date.now(),
      }

      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      console.log(`Clientes guardados en localStorage para usuario ${storageKey}:`, customers.value)
    } catch (error) {
      console.error('Error al guardar clientes en localStorage:', error)
    }
  }

  // Actions
  function addCustomer(customerData) {
    try {
      // Validar datos
      if (!customerData || !customerData.nombre || !customerData.nombre.trim()) {
        throw new Error('Los datos del cliente son inválidos')
      }

      // Crear nuevo cliente con ID único
      lastCustomerId.value += 1
      const newCustomer = {
        id: lastCustomerId.value,
        nombre: customerData.nombre.trim(),
        timestamp: customerData.timestamp || Date.now(),
        fechaRegistro: new Date(customerData.timestamp || Date.now()).toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      }

      // Verificar que no existe un cliente con el mismo nombre (opcional)
      const existingCustomer = customers.value.find(
        (customer) => customer.nombre.toLowerCase() === newCustomer.nombre.toLowerCase(),
      )

      if (existingCustomer) {
        console.warn(`Cliente con nombre "${newCustomer.nombre}" ya existe`)
        // Puedes decidir si permitir duplicados o no
        // throw new Error(`Ya existe un cliente con el nombre "${newCustomer.nombre}"`)
      }

      // Agregar cliente al inicio de la lista (más recientes primero)
      customers.value.unshift(newCustomer)

      // Guardar en localStorage
      saveCustomers()

      console.log('Nuevo cliente agregado:', newCustomer)
      return { success: true, customer: newCustomer }
    } catch (error) {
      console.error('Error al agregar cliente:', error)
      return { success: false, error: error.message }
    }
  }

  function removeCustomer(customerId) {
    try {
      const index = customers.value.findIndex((customer) => customer.id === customerId)

      if (index === -1) {
        throw new Error('Cliente no encontrado')
      }

      const removedCustomer = customers.value.splice(index, 1)[0]
      saveCustomers()

      console.log('Cliente eliminado:', removedCustomer)
      return { success: true, customer: removedCustomer }
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      return { success: false, error: error.message }
    }
  }

  function clearAllCustomers() {
    try {
      customers.value = []
      lastCustomerId.value = 0
      saveCustomers()

      console.log('Todos los clientes han sido eliminados')
      return { success: true }
    } catch (error) {
      console.error('Error al limpiar clientes:', error)
      return { success: false, error: error.message }
    }
  }

  function getCustomerById(customerId) {
    return customers.value.find((customer) => customer.id === customerId)
  }

  function getCustomersByName(name) {
    if (!name || !name.trim()) return []

    const searchTerm = name.toLowerCase().trim()
    return customers.value.filter((customer) => customer.nombre.toLowerCase().includes(searchTerm))
  }

  // Función para inicializar el store cuando cambie el usuario
  function initializeForUser() {
    console.log('Inicializando store de clientes para nuevo usuario')
    loadCustomers()
  }

  // Función para limpiar el store cuando se cierre sesión
  function clearForLogout() {
    console.log('Limpiando store de clientes por cierre de sesión')
    customers.value = []
    lastCustomerId.value = 0
  }

  // Watch para guardar automáticamente cuando cambien los clientes
  watch(
    () => customers.value,
    () => {
      // Solo guardar si hay un usuario autenticado
      const authStore = useAuthStore()
      if (authStore.user) {
        saveCustomers()
      }
    },
    { deep: true },
  )

  return {
    // Estado
    customers,
    lastCustomerId,

    // Computed
    totalCustomers,
    customersToday,
    newestCustomer,
    lastRegistration,

    // Actions
    addCustomer,
    removeCustomer,
    clearAllCustomers,
    getCustomerById,
    getCustomersByName,
    initializeForUser,
    clearForLogout,
    loadCustomers,
    saveCustomers,
  }
})
