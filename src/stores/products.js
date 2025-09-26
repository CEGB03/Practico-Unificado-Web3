import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', () => {
  // Estado
  const products = ref([
    {
      id: 1,
      nombre: 'Laptop Gaming',
      precio: 1299.99,
      stock: 5,
      descripcion: 'Laptop para gaming de alta gama',
    },
    {
      id: 2,
      nombre: 'Mouse Inalámbrico',
      precio: 25.99,
      stock: 0,
      descripcion: 'Mouse ergonómico inalámbrico',
    },
    {
      id: 3,
      nombre: 'Teclado Mecánico',
      precio: 89.99,
      stock: 12,
      descripcion: 'Teclado mecánico RGB',
    },
    {
      id: 4,
      nombre: 'Monitor 4K',
      precio: 299.99,
      stock: 3,
      descripcion: 'Monitor 4K de 27 pulgadas',
    },
    {
      id: 5,
      nombre: 'Auriculares Gaming',
      precio: 79.99,
      stock: 8,
      descripcion: 'Auriculares con micrófono gaming',
    },
  ])

  const searchQuery = ref('')

  // Getters
  const filteredProducts = computed(() => {
    if (!searchQuery.value) {
      return products.value
    }
    return products.value.filter((product) =>
      product.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  })

  const getProductById = computed(() => {
    return (id) => products.value.find((product) => product.id === parseInt(id))
  })

  // Actions
  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function clearSearch() {
    searchQuery.value = ''
  }

  // Gestión de stock
  function reduceStock(productId, quantity = 1) {
    const product = products.value.find((p) => p.id === productId)
    if (product && product.stock >= quantity) {
      product.stock -= quantity
      return true
    }
    return false
  }

  function increaseStock(productId, quantity = 1) {
    const product = products.value.find((p) => p.id === productId)
    if (product) {
      product.stock += quantity
      return true
    }
    return false
  }

  function getAvailableStock(productId) {
    const product = products.value.find((p) => p.id === productId)
    return product ? product.stock : 0
  }

  return {
    products,
    searchQuery,
    filteredProducts,
    getProductById,
    setSearchQuery,
    clearSearch,
    reduceStock,
    increaseStock,
    getAvailableStock,
  }
})
