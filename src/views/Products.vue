<template>
    <div class="products-page">
        <div class="page-header">
            <h1>🛍️ Nuestros Productos</h1>
            <p>Encuentra los mejores productos de tecnología</p>
        </div>

        <div class="products-layout">
            <!-- Lista de productos -->
            <div class="products-section">
                <ProductList @product-added="handleProductAdded" />
            </div>

            <!-- Carrito -->
            <div class="cart-section">
                <Cart />
            </div>
        </div>

        <!-- Toast/notification opcional -->
        <div v-if="showNotification" class="notification">
            {{ notificationMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'
import Cart from '@/components/Cart.vue'
import { useProductsStore } from '@/stores/products'

// Stores
const productsStore = useProductsStore()

// Estado para notificaciones
const showNotification = ref(false)
const notificationMessage = ref('')

// Manejo de eventos
function handleProductAdded(productId) {
    const product = productsStore.products.find((p) => p.id === productId)
    if (product) {
        showNotificationMessage(`"${product.nombre}" agregado al carrito`)
    }
}

function showNotificationMessage(message) {
    notificationMessage.value = message
    showNotification.value = true

    // Ocultar después de 3 segundos
    setTimeout(() => {
        showNotification.value = false
    }, 3000)
}
</script>

<style scoped>
.products-page {
    position: relative;
}

.page-header {
    text-align: center;
    margin-bottom: 2rem;
}

.page-header h1 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
}

.page-header p {
    color: #6c757d;
    font-size: 1.2rem;
    margin: 0;
}

.products-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    align-items: start;
}

.products-section {
    min-width: 0; /* Para permitir que el contenido se encoja */
}

.cart-section {
    position: sticky;
    top: 100px; /* Ajustar según la altura del header */
}

/* Notificación */
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Responsive */
@media (max-width: 1200px) {
    .products-layout {
        grid-template-columns: 1fr 350px;
        gap: 1.5rem;
    }
}

@media (max-width: 968px) {
    .products-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .cart-section {
        position: static;
        order: -1; /* Mostrar el carrito arriba en móviles */
    }

    .notification {
        right: 10px;
        left: 10px;
        right: 10px;
    }
}

@media (max-width: 768px) {
    .page-header h1 {
        font-size: 2rem;
    }

    .page-header p {
        font-size: 1rem;
    }
}
</style>
