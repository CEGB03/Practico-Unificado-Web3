<template>
  <div class="product-detail-page">
    <!-- Navegación breadcrumb -->
    <v-breadcrumbs class="pa-0 mb-4">
      <v-breadcrumbs-item to="/">Inicio /</v-breadcrumbs-item>
      <v-breadcrumbs-item to="/productos">Productos /</v-breadcrumbs-item>
      <v-breadcrumbs-item :disabled="true">{{
        product?.nombre || 'Cargando...'
      }}</v-breadcrumbs-item>
    </v-breadcrumbs>

    <!-- Producto no encontrado -->
    <v-card v-if="!product" class="text-center pa-8" elevation="2">
      <v-icon size="80" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
      <h2 class="text-h4 mb-4">Producto no encontrado</h2>
      <p class="text-body-1 mb-6">El producto con ID {{ $route.params.id }} no existe.</p>
      <v-btn to="/productos" color="primary" variant="elevated">
        <v-icon left>mdi-arrow-left</v-icon>
        Volver a Productos
      </v-btn>
    </v-card>

    <!-- Detalle del producto -->
    <div v-else>
      <v-row>
        <!-- Imagen del producto (simulada) -->
        <v-col cols="12" md="6">
          <v-card elevation="4" rounded="lg" class="overflow-hidden">
            <div class="product-image-container">
              <div class="product-image-placeholder">
                <v-avatar size="160" class="mb-4" color="grey-lighten-4">
                  <v-icon size="100" color="primary">
                    {{ getProductIcon(product.nombre) }}
                  </v-icon>
                </v-avatar>
                <div class="text-center">
                  <v-chip
                    color="primary"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-image-outline"
                  >
                    Vista previa del producto
                  </v-chip>
                </div>
              </div>

              <!-- Galería de imágenes simulada -->
              <v-divider class="my-3"></v-divider>
              <div class="image-gallery d-flex justify-center ga-2">
                <v-btn v-for="n in 3" :key="n" icon size="small" variant="outlined" color="primary">
                  <v-icon size="20">mdi-image</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Información del producto -->
        <v-col cols="12" md="6">
          <v-card elevation="4" rounded="lg" class="h-100">
            <v-card-text class="pa-8">
              <!-- Título y estado con badges mejorados -->
              <div class="mb-6">
                <div class="d-flex justify-space-between align-start mb-3">
                  <h1 class="text-h3 font-weight-bold text-grey-darken-3">
                    {{ product.nombre }}
                  </h1>
                  <v-chip
                    v-if="product.stock === 0"
                    color="error"
                    variant="elevated"
                    size="large"
                    prepend-icon="mdi-alert-circle"
                  >
                    Sin Stock
                  </v-chip>
                  <v-chip
                    v-else-if="product.stock <= 3"
                    color="warning"
                    variant="elevated"
                    size="large"
                    prepend-icon="mdi-alert"
                  >
                    ¡Últimas {{ product.stock }}!
                  </v-chip>
                  <v-chip
                    v-else
                    color="success"
                    variant="elevated"
                    size="large"
                    prepend-icon="mdi-check-circle"
                  >
                    Disponible
                  </v-chip>
                </div>

                <!-- Rating simulado -->
                <div class="d-flex align-center mb-2">
                  <v-rating
                    :model-value="4.5"
                    half-increments
                    readonly
                    size="small"
                    color="amber"
                  ></v-rating>
                  <span class="text-body-2 ml-2 text-grey-darken-1">
                    4.5 ({{ Math.floor(Math.random() * 100) + 20 }} reseñas)
                  </span>
                </div>
              </div>

              <!-- Precio con diseño mejorado -->
              <v-card color="success" variant="tonal" class="mb-6 pa-4" rounded="lg">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-h2 font-weight-bold text-success">
                      ${{ product.precio.toFixed(2) }}
                    </div>
                    <div class="text-body-2 text-grey-darken-1">Precio por unidad</div>
                  </div>
                  <v-icon size="40" color="success">mdi-currency-usd</v-icon>
                </div>
              </v-card>

              <!-- Descripción con mejor styling -->
              <v-card variant="outlined" class="mb-6">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2" color="primary">mdi-information</v-icon>
                    <span class="font-weight-bold text-body-1">Descripción</span>
                  </div>
                  <p class="text-body-1 text-grey-darken-1 mb-0">{{ product.descripcion }}</p>
                </v-card-text>
              </v-card>

              <!-- Indicador de stock mejorado -->
              <v-card
                :color="product.stock === 0 ? 'error' : product.stock <= 3 ? 'warning' : 'success'"
                variant="tonal"
                class="mb-6"
                rounded="lg"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div class="d-flex align-center">
                      <v-icon
                        class="mr-2"
                        :color="
                          product.stock === 0 ? 'error' : product.stock <= 3 ? 'warning' : 'success'
                        "
                      >
                        {{
                          product.stock === 0 ? 'mdi-package-variant-closed' : 'mdi-package-variant'
                        }}
                      </v-icon>
                      <span class="font-weight-bold">Stock Disponible</span>
                    </div>
                    <v-chip
                      :color="
                        product.stock === 0 ? 'error' : product.stock <= 3 ? 'warning' : 'success'
                      "
                      variant="elevated"
                      size="small"
                    >
                      {{ product.stock }} unidades
                    </v-chip>
                  </div>

                  <v-progress-linear
                    :model-value="Math.min((product.stock / 10) * 100, 100)"
                    :color="
                      product.stock === 0 ? 'error' : product.stock <= 3 ? 'warning' : 'success'
                    "
                    height="12"
                    rounded
                    class="mb-2"
                  ></v-progress-linear>

                  <div class="text-caption">
                    <template v-if="product.stock === 0">
                      Producto agotado - Te notificaremos cuando esté disponible
                    </template>
                    <template v-else-if="product.stock <= 3">
                      ¡Solo quedan {{ product.stock }} unidades! - Compra ahora
                    </template>
                    <template v-else> Producto en stock - Entrega inmediata disponible </template>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Información adicional con cards -->
              <v-row class="mb-6">
                <v-col cols="4">
                  <v-card variant="outlined" class="text-center pa-3">
                    <v-icon size="30" color="primary" class="mb-2">mdi-identifier</v-icon>
                    <div class="text-caption text-grey-darken-1">ID Producto</div>
                    <div class="font-weight-bold">#{{ product.id }}</div>
                  </v-card>
                </v-col>

                <v-col cols="4">
                  <v-card variant="outlined" class="text-center pa-3">
                    <v-icon size="30" color="blue" class="mb-2">mdi-tag</v-icon>
                    <div class="text-caption text-grey-darken-1">Categoría</div>
                    <div class="font-weight-bold">Tecnología</div>
                  </v-card>
                </v-col>

                <v-col cols="4">
                  <v-card variant="outlined" class="text-center pa-3">
                    <v-icon size="30" color="green" class="mb-2">mdi-truck-delivery</v-icon>
                    <div class="text-caption text-grey-darken-1">Envío</div>
                    <div class="font-weight-bold">Gratis</div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Características adicionales -->
              <v-expansion-panels variant="accordion" class="mb-6">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2" color="primary">mdi-feature-search</v-icon>
                      Características Técnicas
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="blue">mdi-bluetooth</v-icon>
                        </template>
                        <v-list-item-title>Conectividad Inalámbrica</v-list-item-title>
                        <v-list-item-subtitle>Bluetooth 5.0</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="green">mdi-battery</v-icon>
                        </template>
                        <v-list-item-title>Batería</v-list-item-title>
                        <v-list-item-subtitle>Hasta 12 meses de uso</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="orange">mdi-hand</v-icon>
                        </template>
                        <v-list-item-title>Diseño Ergonómico</v-list-item-title>
                        <v-list-item-subtitle>Ambidiestro</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Acciones mejoradas -->
              <v-card color="grey-lighten-5" variant="flat" class="pa-4" rounded="lg">
                <div class="d-flex flex-column ga-3">
                  <!-- Botón principal de agregar al carrito -->
                  <v-btn
                    @click="addToCart"
                    :disabled="product.stock === 0"
                    :color="product.stock === 0 ? 'error' : 'success'"
                    size="x-large"
                    :variant="product.stock === 0 ? 'tonal' : 'elevated'"
                    block
                    class="text-none font-weight-bold"
                    rounded="lg"
                  >
                    <template v-if="product.stock === 0">
                      <v-icon class="mr-2">mdi-alert-circle</v-icon>
                      Producto Agotado
                    </template>
                    <template v-else>
                      <v-icon class="mr-2">mdi-cart-plus</v-icon>
                      Agregar al Carrito
                      <v-spacer></v-spacer>
                      ${{ product.precio.toFixed(2) }}
                    </template>
                  </v-btn>

                  <!-- Botones secundarios -->
                  <v-row class="ga-2">
                    <v-col cols="6">
                      <v-btn
                        v-if="product.stock === 0"
                        color="primary"
                        variant="outlined"
                        block
                        size="large"
                        rounded="lg"
                      >
                        <v-icon class="mr-1">mdi-bell</v-icon>
                        Notificarme
                      </v-btn>
                      <v-btn v-else color="orange" variant="tonal" block size="large" rounded="lg">
                        <v-icon class="mr-1">mdi-heart</v-icon>
                        Favoritos
                      </v-btn>
                    </v-col>

                    <v-col cols="6">
                      <v-btn color="blue" variant="tonal" block size="large" rounded="lg">
                        <v-icon class="mr-1">mdi-share</v-icon>
                        Compartir
                      </v-btn>
                    </v-col>
                  </v-row>

                  <!-- Botón de volver -->
                  <v-btn
                    to="/productos"
                    color="grey-darken-1"
                    variant="text"
                    size="large"
                    class="text-none"
                  >
                    <v-icon class="mr-2">mdi-arrow-left</v-icon>
                    Volver a Productos
                  </v-btn>
                </div>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sección de productos relacionados mejorada -->
      <v-card class="mt-8" elevation="4" rounded="lg">
        <v-card-title class="pa-6 bg-gradient-primary">
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-3" color="white">
              <v-icon color="primary">mdi-star</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold text-white">Productos Relacionados</h3>
              <p class="text-caption text-grey-lighten-3 mb-0">Te podría interesar también</p>
            </div>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row>
            <v-col
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                @click="goToProduct(relatedProduct.id)"
                elevation="2"
                class="cursor-pointer product-card"
                hover
                rounded="lg"
              >
                <v-card-text class="pa-4">
                  <div class="text-center mb-3">
                    <v-avatar size="60" color="grey-lighten-4" class="mb-3">
                      <v-icon size="35" color="primary">
                        {{ getProductIcon(relatedProduct.nombre) }}
                      </v-icon>
                    </v-avatar>

                    <div class="text-subtitle-1 font-weight-bold mb-1">
                      {{ relatedProduct.nombre }}
                    </div>

                    <!-- Rating para productos relacionados -->
                    <v-rating
                      :model-value="3.5 + Math.random() * 1.5"
                      half-increments
                      readonly
                      size="x-small"
                      color="amber"
                      class="mb-2"
                    ></v-rating>
                  </div>

                  <v-divider class="mb-3"></v-divider>

                  <div class="d-flex justify-space-between align-center">
                    <div class="text-h6 font-weight-bold text-success">
                      ${{ relatedProduct.precio.toFixed(2) }}
                    </div>

                    <v-chip
                      :color="relatedProduct.stock > 0 ? 'success' : 'error'"
                      size="small"
                      variant="tonal"
                    >
                      {{ relatedProduct.stock > 0 ? 'Disponible' : 'Agotado' }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Snackbar de confirmación mejorado -->
    <v-snackbar
      v-model="showAddedMessage"
      color="success"
      timeout="4000"
      location="bottom right"
      variant="elevated"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-avatar size="40" color="white" class="mr-3">
          <v-icon color="success">mdi-check-circle</v-icon>
        </v-avatar>
        <div>
          <div class="font-weight-bold">¡Producto agregado!</div>
          <div class="text-caption">{{ product?.nombre }} se añadió al carrito</div>
        </div>
      </div>

      <template v-slot:actions>
        <v-btn variant="text" color="white" size="small" @click="showAddedMessage = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

// Router y stores
const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

// Estado local
const showAddedMessage = ref(false)

// Computed
const product = computed(() => {
  const id = parseInt(route.params.id)
  return productsStore.getProductById(id)
})

const relatedProducts = computed(() => {
  if (!product.value) return []

  // Obtener productos relacionados (excluyendo el actual)
  return productsStore.products.filter((p) => p.id !== product.value.id).slice(0, 3)
})

// Methods
function addToCart() {
  if (product.value && product.value.stock > 0) {
    cartStore.addToCart(product.value.id)
    showAddedMessage.value = true
  }
}

function goToProduct(productId) {
  router.push(`/productos/${productId}`)
}

function getProductIcon(productName) {
  const name = productName.toLowerCase()
  if (name.includes('laptop') || name.includes('computadora')) {
    return 'mdi-laptop'
  } else if (name.includes('mouse')) {
    return 'mdi-mouse'
  } else if (name.includes('teclado') || name.includes('keyboard')) {
    return 'mdi-keyboard'
  } else if (name.includes('monitor') || name.includes('pantalla')) {
    return 'mdi-monitor'
  } else if (name.includes('auricular') || name.includes('headphone')) {
    return 'mdi-headphones'
  } else if (name.includes('teléfono') || name.includes('phone')) {
    return 'mdi-cellphone'
  } else if (name.includes('tablet')) {
    return 'mdi-tablet'
  } else {
    return 'mdi-package-variant'
  }
}

// Lifecycle
onMounted(() => {
  // Scroll al top cuando se carga la página
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.product-image-container {
  padding: 24px;
}

.product-image-placeholder {
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.product-image-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  );
}

.image-gallery {
  padding: 0 16px;
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
}

.product-card {
  transition: all 0.3s ease-in-out;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.bg-gradient-primary {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
}

/* Animaciones de entrada */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-detail-page > * {
  animation: slideInUp 0.6s ease-out;
}

/* Responsive */
@media (max-width: 960px) {
  .product-image-placeholder {
    height: 280px;
  }

  .product-detail-page {
    padding: 0 12px;
  }
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.8rem !important;
  }

  .text-h3 {
    font-size: 2rem !important;
  }

  .product-image-placeholder {
    height: 250px;
  }

  .product-detail-page {
    padding: 0 8px;
  }
}
</style>
