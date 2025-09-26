<template>
  <v-card class="cart-card" elevation="3">
    <!-- Encabezado -->
    <v-card-title class="d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <v-icon color="primary" class="me-2">mdi-shopping-outline</v-icon>
        <span class="text-h6">Carrito de Compras</span>
      </div>
      <v-chip v-if="!isEmpty" color="primary" variant="flat" size="small">
        {{ totalItems }} {{ totalItems === 1 ? 'artículo' : 'artículos' }}
      </v-chip>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Estado vacío -->
    <v-card-text v-if="isEmpty" class="text-center pa-6">
      <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-shopping-outline</v-icon>
      <h3 class="text-h6 mb-2">Tu carrito está vacío</h3>
      <p class="text-body-2 text-grey mb-4">Agrega algunos productos para comenzar</p>

      <!-- Estadísticas rápidas cuando el carrito está vacío -->
      <v-divider class="my-4"></v-divider>
      <div class="text-caption text-grey mb-2">Productos disponibles</div>
      <v-row dense>
        <v-col cols="4">
          <div class="text-body-2 font-weight-bold">{{ availableProducts }}</div>
          <div class="text-caption">Total</div>
        </v-col>
        <v-col cols="4">
          <div class="text-body-2 font-weight-bold text-warning">{{ lowStockProducts }}</div>
          <div class="text-caption">Poco stock</div>
        </v-col>
        <v-col cols="4">
          <div class="text-body-2 font-weight-bold text-error">{{ outOfStockProducts }}</div>
          <div class="text-caption">Sin stock</div>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Ítems del carrito -->
    <div v-else>
      <v-card-text class="pa-0">
        <v-list>
          <v-list-item
            v-for="(item, index) in cartItemsWithDetails"
            :key="item.id"
            class="px-4 py-3"
          >
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-3" size="40">
                <v-icon>mdi-package-variant</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="text-subtitle-1 font-weight-medium">
              {{ item.nombre }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption mb-1">
              ${{ item.precio.toFixed(2) }} × {{ item.cantidad }}
            </v-list-item-subtitle>

            <v-list-item-subtitle class="text-caption">
              <template v-if="getProductStock(item.id) === 0">
                <v-icon size="small" color="error" class="me-1">mdi-alert-circle</v-icon>
                <span class="text-error">Sin más stock disponible</span>
              </template>
              <template v-else-if="getProductStock(item.id) <= 3">
                <v-icon size="small" color="warning" class="me-1">mdi-alert</v-icon>
                <span class="text-warning">Solo {{ getProductStock(item.id) }} disponibles</span>
              </template>
              <template v-else>
                <v-icon size="small" color="success" class="me-1">mdi-check-circle</v-icon>
                <span class="text-success">{{ getProductStock(item.id) }} disponibles</span>
              </template>
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="d-flex align-center">
                <!-- Controles de cantidad -->
                <div class="d-flex align-center me-4">
                  <v-btn
                    @click="decreaseQuantity(item.id)"
                    :icon="item.cantidad === 1 ? 'mdi-delete' : 'mdi-minus'"
                    :color="item.cantidad === 1 ? 'error' : 'primary'"
                    variant="text"
                    size="small"
                    density="compact"
                  ></v-btn>

                  <span class="mx-3 text-subtitle-1 font-weight-medium">
                    {{ item.cantidad }}
                  </span>

                  <v-btn
                    @click="increaseQuantity(item.id)"
                    icon="mdi-plus"
                    :color="getProductStock(item.id) === 0 ? 'grey' : 'primary'"
                    :disabled="getProductStock(item.id) === 0"
                    variant="text"
                    size="small"
                    density="compact"
                  ></v-btn>
                </div>

                <!-- Subtotal -->
                <div class="text-h6 text-success font-weight-bold">
                  ${{ item.subtotal.toFixed(2) }}
                </div>
              </div>
            </template>

            <v-divider v-if="index < cartItemsWithDetails.length - 1"></v-divider>
          </v-list-item>
        </v-list>
      </v-card-text>

      <!-- Total y acciones -->
      <v-divider></v-divider>

      <v-card-actions class="flex-column pa-4">
        <!-- Botón vaciar carrito -->
        <v-btn @click="clearCart" variant="outlined" color="error" class="mb-3" block>
          <v-icon left>mdi-delete-sweep</v-icon>
          Vaciar carrito
        </v-btn>

        <!-- Total -->
        <v-card variant="tonal" color="success" class="w-100 mb-3">
          <v-card-text class="text-center pa-3">
            <div class="text-h5 font-weight-bold">Total: ${{ totalAmount.toFixed(2) }}</div>
          </v-card-text>
        </v-card>

        <!-- Botón proceder al pago -->
        <v-btn color="success" variant="elevated" size="large" block>
          <v-icon left>mdi-credit-card</v-icon>
          Proceder al pago
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'

// Stores
const cartStore = useCartStore()
const productsStore = useProductsStore()

// Computed properties
const cartItemsWithDetails = computed(() => cartStore.cartItemsWithDetails)
const totalItems = computed(() => cartStore.totalItems)
const totalAmount = computed(() => cartStore.totalAmount)
const isEmpty = computed(() => cartStore.isEmpty)

// Estadísticas de productos para mostrar cuando el carrito está vacío
const availableProducts = computed(() => productsStore.products.length)
const lowStockProducts = computed(
  () => productsStore.products.filter((p) => p.stock > 0 && p.stock <= 3).length,
)
const outOfStockProducts = computed(
  () => productsStore.products.filter((p) => p.stock === 0).length,
)

// Eventos
const emit = defineEmits(['stock-warning'])

// Methods
function increaseQuantity(productId) {
  const success = cartStore.increaseQuantity(productId)

  if (!success) {
    // Emitir evento de advertencia cuando no hay más stock
    const item = cartItemsWithDetails.value.find((item) => item.id === productId)
    if (item) {
      emit('stock-warning', {
        productId,
        productName: item.nombre,
        message: `No hay más stock disponible para "${item.nombre}"`,
      })
    }
  }
}

function decreaseQuantity(productId) {
  cartStore.decreaseQuantity(productId)
}

function clearCart() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cartStore.clearCart()
  }
}

function getProductStock(productId) {
  const product = productsStore.products.find((p) => p.id === productId)
  return product ? product.stock : 0
}
</script>

<style scoped>
/* Vuetify se encarga de la mayoría de estilos */
.cart-card {
  max-width: 500px;
  width: 100%;
}
</style>
