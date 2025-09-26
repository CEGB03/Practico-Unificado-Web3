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
          hover
          class="cursor-pointer"
          @click="goToProductDetail(product.id)"
        >
          <v-card-title class="d-flex justify-space-between align-start pa-4">
            <span class="text-h6">{{ product.nombre }}</span>
            <div>
              <v-chip v-if="product.stock === 0" color="error" size="small" variant="flat">
                Sin Stock
              </v-chip>
              <v-chip v-else-if="product.stock <= 3" color="warning" size="small" variant="flat">
                Poco Stock ({{ product.stock }})
              </v-chip>
              <v-chip v-else color="success" size="small" variant="flat">
                Stock: {{ product.stock }}
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text>
            <p class="text-body-2 mb-3">{{ product.descripcion }}</p>

            <!-- Información de stock detallada -->
            <div class="mb-3">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-caption text-grey">Disponibilidad:</span>
                <span class="text-caption font-weight-medium">
                  {{ product.stock }} {{ product.stock === 1 ? 'unidad' : 'unidades' }}
                </span>
              </div>

              <!-- Indicador de stock visual -->
              <v-progress-linear
                :model-value="Math.min((product.stock / 10) * 100, 100)"
                :color="product.stock === 0 ? 'error' : product.stock <= 3 ? 'warning' : 'success'"
                height="8"
                rounded
              ></v-progress-linear>

              <div class="text-caption text-grey mt-1">
                <template v-if="product.stock === 0"> Producto agotado </template>
                <template v-else-if="product.stock <= 3"> ¡Últimas unidades! </template>
                <template v-else> Producto disponible </template>
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <div class="text-h6 text-success font-weight-bold me-3">
              ${{ product.precio.toFixed(2) }}
            </div>
            <v-btn
              @click.stop="handleAddToCart(product.id)"
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
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

// Router y Stores
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

// Computed properties
const searchQuery = computed({
  get: () => productsStore.searchQuery,
  set: (value) => productsStore.setSearchQuery(value),
})

const filteredProducts = computed(() => productsStore.filteredProducts)

// Eventos
const emit = defineEmits(['product-added', 'product-error'])

// Methods
function handleSearch(event) {
  productsStore.setSearchQuery(event.target.value)
}

function clearSearch() {
  productsStore.clearSearch()
}

function handleAddToCart(productId) {
  const success = cartStore.addToCart(productId)
  const product = productsStore.products.find((p) => p.id === productId)

  if (success) {
    emit('product-added', productId)

    if (product) {
      console.log(`Producto "${product.nombre}" agregado al carrito`)
    }
  } else {
    // Emitir evento de error cuando no se puede agregar
    if (product) {
      emit('product-error', {
        productId,
        productName: product.nombre,
        message: `No hay stock disponible para "${product.nombre}"`,
      })
      console.warn(`No se puede agregar "${product.nombre}" - Sin stock disponible`)
    }
  }
}

function goToProductDetail(productId) {
  router.push(`/productos/${productId}`)
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

.cursor-pointer {
  cursor: pointer;
}
</style>
