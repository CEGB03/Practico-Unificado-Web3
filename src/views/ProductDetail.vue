<template>
    <div class="product-detail">
        <!-- Botón volver -->
        <div class="back-navigation">
        <router-link to="/productos" class="btn-back">
            ← Volver a Productos
        </router-link>
        </div>

        <!-- Producto encontrado -->
        <div v-if="product" class="product-content">
        <div class="product-header">
            <h1>{{ product.nombre }}</h1>
            <div class="product-price">
            <span class="price">${{ product.precio }}</span>
            </div>
        </div>

        <div class="product-details">
            <div class="detail-section">
            <h3>📦 Información del Producto</h3>
            <div class="detail-grid">
                <div class="detail-item">
                <strong>ID:</strong> {{ product.id }}
                </div>
                <div class="detail-item">
                <strong>Precio:</strong> ${{ product.precio }}
                </div>
                <div class="detail-item">
                <strong>Stock disponible:</strong> 
                <span :class="stockClass">{{ product.stock }} unidades</span>
                </div>
                <div class="detail-item">
                <strong>Estado:</strong>
                <span :class="statusClass">{{ productStatus }}</span>
                </div>
            </div>
            </div>

            <div class="detail-section">
            <h3>🛒 Agregar al Carrito</h3>
            <div class="add-to-cart-section">
                <div class="quantity-controls">
                <label for="quantity">Cantidad:</label>
                <div class="quantity-input">
                    <button 
                    @click="decreaseQuantity" 
                    :disabled="quantity <= 1"
                    class="btn btn-sm"
                    >-</button>
                    <input 
                    id="quantity"
                    v-model.number="quantity" 
                    type="number" 
                    min="1" 
                    :max="product.stock"
                    class="quantity-field"
                    />
                    <button 
                    @click="increaseQuantity" 
                    :disabled="quantity >= product.stock"
                    class="btn btn-sm"
                    >+</button>
                </div>
                </div>
                
                <button 
                @click="addToCart"
                :disabled="product.stock === 0"
                :class="addToCartButtonClass"
                >
                {{ addToCartButtonText }}
                </button>
            </div>
            </div>
        </div>
        </div>

        <!-- Producto no encontrado -->
        <div v-else class="product-not-found">
        <div class="not-found-content">
            <h2>❌ Producto no encontrado</h2>
            <p>El producto con ID "{{ $route.params.id }}" no existe en nuestro catálogo.</p>
            <router-link to="/productos" class="btn btn-primary">
            Ver todos los productos
            </router-link>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Datos de productos (idealmente vendrían de un store o API)
const products = ref([
    { id: 1, nombre: 'Laptop Gaming', precio: 1200, stock: 5 },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 25, stock: 0 },
    { id: 3, nombre: 'Teclado Mecánico', precio: 80, stock: 3 },
    { id: 4, nombre: 'Teclado Mecánico RGB', precio: 80, stock: 3 },
    { id: 5, nombre: 'Teclado Mecánico Gaming', precio: 80, stock: 3 },
    { id: 6, nombre: 'Monitor 4K', precio: 300, stock: 2 },
    { id: 7, nombre: 'Auriculares Gaming', precio: 150, stock: 0 },
    { id: 8, nombre: 'Webcam HD', precio: 70, stock: 4 },
    { id: 9, nombre: 'Disco Duro Externo', precio: 100, stock: 6 },
    { id: 10, nombre: 'Router WiFi 6', precio: 200, stock: 1 }
])

const quantity = ref(1)

// Computed para encontrar el producto
const product = computed(() => {
    const id = parseInt(route.params.id)
    return products.value.find(p => p.id === id)
})

// Computed para el estado del stock
const stockClass = computed(() => {
    if (!product.value) return ''
    if (product.value.stock === 0) return 'stock-out'
    if (product.value.stock <= 2) return 'stock-low'
    return 'stock-good'
})

const statusClass = computed(() => {
    if (!product.value) return ''
    return product.value.stock > 0 ? 'status-available' : 'status-unavailable'
})

const productStatus = computed(() => {
    if (!product.value) return ''
    return product.value.stock > 0 ? 'Disponible' : 'Sin stock'
})

const addToCartButtonClass = computed(() => {
    if (!product.value) return 'btn btn-disabled'
    
    return {
        'btn': true,
        'btn-primary': product.value.stock > 0,
        'btn-disabled': product.value.stock === 0,
        'btn-warning': product.value.stock <= 2 && product.value.stock > 0
    }
})

const addToCartButtonText = computed(() => {
    if (!product.value) return 'Producto no encontrado'
    if (product.value.stock === 0) return 'Sin stock'
    if (product.value.stock <= 2) return `Agregar ${quantity.value} (¡Pocas unidades!)`
    return `Agregar ${quantity.value} al carrito`
})

// Métodos
const increaseQuantity = () => {
    if (product.value && quantity.value < product.value.stock) {
        quantity.value += 1
    }
}

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value -= 1
    }
}

const addToCart = () => {
    if (!product.value || product.value.stock === 0) return
    
    // Simular agregar al carrito
    console.log(`Agregando ${quantity.value} unidades de ${product.value.nombre} al carrito`)
    alert(`¡${quantity.value} unidades de ${product.value.nombre} agregadas al carrito!`)
    
    // Opcional: navegar de vuelta a productos
    // router.push('/productos')
}

// Validar que la cantidad no exceda el stock
const validateQuantity = () => {
    if (product.value) {
        if (quantity.value > product.value.stock) {
        quantity.value = product.value.stock
        }
        if (quantity.value < 1) {
        quantity.value = 1
        }
    }
}

onMounted(() => {
    validateQuantity()
})
</script>

<style scoped>
.product-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.back-navigation {
    margin-bottom: 20px;
}

.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #6c757d;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.3s ease;
}

.btn-back:hover {
    background: #5a6268;
}

.product-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
}

.product-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    text-align: center;
}

.product-header h1 {
    margin: 0 0 15px 0;
    font-size: 2.5rem;
}

.price {
    font-size: 2rem;
    font-weight: bold;
}

.product-details {
    padding: 30px;
}

.detail-section {
    margin-bottom: 30px;
}

.detail-section h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.3rem;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.detail-item {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid #007bff;
}

.stock-good { color: #28a745; font-weight: bold; }
.stock-low { color: #ffc107; font-weight: bold; }
.stock-out { color: #dc3545; font-weight: bold; }

.status-available { 
    color: #28a745; 
    font-weight: bold;
    padding: 4px 8px;
    background: #d4edda;
    border-radius: 4px;
}

.status-unavailable { 
    color: #dc3545; 
    font-weight: bold;
    padding: 4px 8px;
    background: #f8d7da;
    border-radius: 4px;
}

.add-to-cart-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.quantity-controls {
    margin-bottom: 20px;
}

.quantity-controls label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #495057;
}

.quantity-input {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.quantity-field {
    width: 60px;
    padding: 8px;
    text-align: center;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 14px;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

.btn-warning {
    background: #ffc107;
    color: #212529;
}

.btn-warning:hover:not(:disabled) {
    background: #e0a800;
}

.btn-disabled {
    background: #6c757d;
    color: white;
    cursor: not-allowed;
    opacity: 0.6;
}

.product-not-found {
    text-align: center;
    padding: 60px 20px;
}

.not-found-content {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.not-found-content h2 {
    color: #dc3545;
    margin-bottom: 15px;
}

.not-found-content p {
    color: #6c757d;
    margin-bottom: 25px;
    font-size: 1.1rem;
}
</style>