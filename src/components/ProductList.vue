<template>
  <div class="product-list">
    <!-- Campo de búsqueda con Vuetify -->
    <v-text-field
      v-model="searchQuery"
      label="Buscar productos por nombre..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-6"
      @input="handleSearch"
      @click:clear="clearSearch"
    ></v-text-field>
    <!-- Estado vacío -->
    <!-- Estado vacío -->
    <v-card v-if="filteredProducts.length === 0" class="text-center pa-8" variant="outlined">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-magnify</v-icon>
      <h3 class="text-h5 mb-2">No se encontraron productos</h3>
      <p v-if="searchQuery" class="text-body-1 mb-4">
        No hay productos que coincidan con "{{ searchQuery }}"
      </p>
      <p v-else class="text-body-1 mb-4">No hay productos disponibles</p>
      <v-btn v-if="searchQuery" @click="clearSearch" color="secondary" variant="outlined">
        Limpiar búsqueda
      </v-btn>
    </v-card>

    <!-- Lista de productos -->
    <v-row v-else>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4">
        <v-card
          :class="{ 'product-out-of-stock': product.stock === 0 }"
          elevation="2"
          height="100%"
        >
          <v-card-title class="d-flex justify-space-between align-start pa-4">
            <span class="text-h6">{{ product.nombre }}</span>
            <v-chip v-if="product.stock === 0" color="error" size="small" variant="flat">
              Sin Stock
            </v-chip>
            <v-chip v-else-if="product.stock <= 3" color="warning" size="small" variant="flat">
              Poco Stock ({{ product.stock }})
            </v-chip>
          </v-card-title>

          <v-card-text>
            <p class="text-body-2 mb-3">{{ product.descripcion }}</p>

            <!-- Indicador de stock visual -->
            <v-progress-linear
              :model-value="Math.min((product.stock / 10) * 100, 100)"
              :color="product.stock === 0 ? 'error' : product.stock <= 3 ? 'warning' : 'success'"
              height="6"
              rounded
              class="mb-3"
            ></v-progress-linear>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <div class="text-h6 text-success font-weight-bold me-3">
              ${{ product.precio.toFixed(2) }}
            </div>
            <v-btn
              @click="handleAddToCart(product.id)"
              :disabled="product.stock === 0"
              :color="product.stock === 0 ? 'grey' : 'primary'"
              :variant="product.stock === 0 ? 'text' : 'elevated'"
            >
              <v-icon left>
                {{ product.stock === 0 ? 'mdi-close-circle' : 'mdi-cart-plus' }}
              </v-icon>
              {{ product.stock === 0 ? 'Sin Stock' : 'Agregar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

// Stores
const productsStore = useProductsStore()
const cartStore = useCartStore()

// Computed properties
const searchQuery = computed({
  get: () => productsStore.searchQuery,
  set: (value) => productsStore.setSearchQuery(value),
})

const filteredProducts = computed(() => productsStore.filteredProducts)

// Eventos
const emit = defineEmits(['product-added'])

// Methods
function handleSearch(event) {
  productsStore.setSearchQuery(event.target.value)
}

function clearSearch() {
  productsStore.clearSearch()
}

function handleAddToCart(productId) {
  cartStore.addToCart(productId)
  emit('product-added', productId)

  // Feedback visual opcional
  const product = productsStore.products.find((p) => p.id === productId)
  if (product) {
    console.log(`Producto "${product.nombre}" agregado al carrito`)
  }
}
</script>

<style scoped>
/* Solo necesitamos estilos mínimos para personalizar Vuetify */
.product-out-of-stock {
  opacity: 0.7;
}

.product-out-of-stock .v-card {
  filter: grayscale(0.3);
}
</style>
