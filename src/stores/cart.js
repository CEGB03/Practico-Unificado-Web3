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
        const existingItem = cartItems.value.find((item) => item.id === productId)

        if (existingItem) {
            existingItem.cantidad++
        } else {
        cartItems.value.push({
            id: productId,
            cantidad: 1,
        })
        }
    }

    function increaseQuantity(productId) {
        const item = cartItems.value.find((item) => item.id === productId)
        if (item) {
            item.cantidad++
        }
    }

    function decreaseQuantity(productId) {
        const item = cartItems.value.find((item) => item.id === productId)
        if (item) {
            if (item.cantidad > 1) {
                item.cantidad--
            } else {
                removeFromCart(productId)
            }
        }
    }

    function removeFromCart(productId) {
        const index = cartItems.value.findIndex((item) => item.id === productId)
        if (index > -1) {
            cartItems.value.splice(index, 1)
        }
    }

    function clearCart() {
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
