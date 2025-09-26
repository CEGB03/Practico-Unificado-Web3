import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'

export function useCart() {
  const cartStore = useCartStore()
  const productsStore = useProductsStore()

  const items = computed(() => cartStore.cartItemsWithDetails)
  const totalItems = computed(() => cartStore.totalItems)
  const totalAmount = computed(() => cartStore.totalAmount)
  const isEmpty = computed(() => cartStore.isEmpty)

  const addItem = (productId) => {
    const product = productsStore.products.find((p) => p.id === productId)
    if (!product || product.stock <= 0) {
      return { success: false, message: 'Producto sin stock' }
    }

    const success = cartStore.addToCart(productId)
    return {
      success,
      message: success ? `${product.nombre} agregado al carrito` : 'Error al agregar producto',
    }
  }

  const removeItem = (productId) => {
    cartStore.removeFromCart(productId)
    return { success: true, message: 'Producto eliminado del carrito' }
  }

  const updateQuantity = (productId, action) => {
    if (action === 'increase') {
      return cartStore.increaseQuantity(productId)
    } else if (action === 'decrease') {
      return cartStore.decreaseQuantity(productId)
    }
    return false
  }

  const clear = () => {
    cartStore.clearCart()
    return { success: true, message: 'Carrito vaciado' }
  }

  return {
    // State
    items,
    totalItems,
    totalAmount,
    isEmpty,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clear,
  }
}
