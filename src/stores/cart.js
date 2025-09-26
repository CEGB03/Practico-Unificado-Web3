import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useProductsStore } from './products'

export const useCartStore = defineStore('cart', () => {
  // Estado
  const cartItems = ref([])

  // Getters
  const cartItemsWithDetails = computed(() => {
    const productsStore = useProductsStore()
    return cartItems.value.map((item) => {
      const product = productsStore.products.find((p) => p.id === item.id)
      return {
        ...item,
        nombre: product?.nombre || 'Producto no encontrado',
        precio: product?.precio || 0,
        subtotal: (product?.precio || 0) * item.cantidad,
      }
    })
  })

  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.cantidad, 0)
  })

  const totalAmount = computed(() => {
    return cartItemsWithDetails.value.reduce((total, item) => total + item.subtotal, 0)
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  // Actions
  function addToCart(productId) {
    const productsStore = useProductsStore()
    const availableStock = productsStore.getAvailableStock(productId)

    if (availableStock <= 0) {
      console.warn('No hay stock disponible para este producto')
      return false
    }

    const existingItem = cartItems.value.find((item) => item.id === productId)

    if (existingItem) {
      // Verificar si hay stock suficiente para incrementar
      if (availableStock > 0) {
        existingItem.cantidad++
        productsStore.reduceStock(productId, 1)
        return true
      } else {
        console.warn('No hay más stock disponible')
        return false
      }
    } else {
      // Nuevo item en el carrito
      cartItems.value.push({
        id: productId,
        cantidad: 1,
      })
      productsStore.reduceStock(productId, 1)
      return true
    }
  }

  function increaseQuantity(productId) {
    const productsStore = useProductsStore()
    const availableStock = productsStore.getAvailableStock(productId)

    if (availableStock <= 0) {
      console.warn('No hay más stock disponible')
      return false
    }

    const item = cartItems.value.find((item) => item.id === productId)
    if (item) {
      item.cantidad++
      productsStore.reduceStock(productId, 1)
      return true
    }
    return false
  }

  function decreaseQuantity(productId) {
    const productsStore = useProductsStore()
    const item = cartItems.value.find((item) => item.id === productId)

    if (item) {
      if (item.cantidad > 1) {
        item.cantidad--
        productsStore.increaseStock(productId, 1)
      } else {
        // Restaurar todo el stock del producto antes de eliminarlo
        productsStore.increaseStock(productId, item.cantidad)
        removeFromCart(productId)
      }
      return true
    }
    return false
  }

  function removeFromCart(productId) {
    const productsStore = useProductsStore()
    const item = cartItems.value.find((item) => item.id === productId)

    if (item) {
      // Restaurar el stock completo del producto
      productsStore.increaseStock(productId, item.cantidad)
    }

    const index = cartItems.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  function clearCart() {
    const productsStore = useProductsStore()

    // Restaurar el stock de todos los productos en el carrito
    cartItems.value.forEach((item) => {
      productsStore.increaseStock(item.id, item.cantidad)
    })

    cartItems.value = []
  }

  return {
    cartItems,
    cartItemsWithDetails,
    totalItems,
    totalAmount,
    isEmpty,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  }
})
