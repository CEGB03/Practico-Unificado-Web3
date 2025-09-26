<template>
    <div>
        <!-- Input de búsqueda -->
        <input 
        v-model="searchQuery" 
        placeholder="Buscar productos..."
        class="search-box"
        />
    
        <!-- Lista de productos -->
        <div v-if="filteredProducts.length > 0" class="product-grid">
            <div 
                v-for="product in filteredProducts" 
                :key="`product-${product.id}`" 
                :class="{ 'product-card': true, 'out-of-stock': product.stock === 0 }"
            >
                <h3>{{ product.nombre }}</h3>
                <p>Precio: ${{ product.precio }}</p>
                <p :class="{ 'stock-low': product.stock <= 2 && product.stock > 0, 'stock-out': product.stock === 0 }">
                    Stock: {{ product.stock }}
                    <span v-if="product.stock <= 2 && product.stock > 0" class="stock-warning">¡Últimas unidades!</span>
                </p>
                <span v-if="product.stock === 0" class="stock-badge">Sin Stock</span>
                
                <div class="product-actions">
                  <!-- Botón ver detalle -->
                  <router-link 
                    :to="`/productos/${product.id}`" 
                    class="btn btn-outline"
                  >
                    Ver Detalle
                  </router-link>
                  
                  <!-- Botón agregar al carrito -->
                  <button 
                    @click="addToCart(product.id)"
                    :disabled="product.stock === 0"
                    :class="{ 
                        'btn': true, 
                        'btn-primary': product.stock > 0,
                        'btn-disabled': product.stock === 0,
                        'btn-warning': product.stock <= 2 && product.stock > 0
                    }"
                  >
                    {{ getButtonText(product.stock) }}
                  </button>
                </div>
            </div>
        </div>
        
        <!-- Estado vacío -->
        <div v-else class="empty-state">
            No se encontraron productos que coincidan con "{{ searchQuery }}"
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    products: Array
})

const emit = defineEmits(['add-to-cart'])

const searchQuery = ref('')

const filteredProducts = computed(() => {
    return props.products.filter(product => 
        product.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const addToCart = (productId) => {
    emit('add-to-cart', productId)
}

const getButtonText = (stock) => {
    if (stock === 0) return 'Sin Stock'
    if (stock <= 2) return 'Agregar (¡Pocas!)'
    return 'Agregar'
}
</script>

<style>
.search-box {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.product-card {
    background: #fff;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    position: relative;
}

.out-of-stock {
    opacity: 0.5;
}

.stock-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    padding: 5px;
    border-radius: 3px;
}

.product-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.btn {
    display: inline-block;
    padding: 8px 12px;
    background: #007bff;
    color: white;
    text-align: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    flex: 1;
}

.btn-primary {
    background: #007bff;
}

.btn-outline {
    background: transparent;
    color: #007bff;
    border: 1px solid #007bff;
}

.btn-outline:hover {
    background: #007bff;
    color: white;
}

.btn-warning {
    background: #ffc107;
    color: #212529;
}

.btn-disabled {
    background: #6c757d;
    cursor: not-allowed;
}

/* Estilos para indicadores de stock */
.stock-low {
    color: #ff6b35;
    font-weight: bold;
}

.stock-out {
    color: #dc3545;
    font-weight: bold;
}

.stock-warning {
    font-size: 0.8em;
    background: #fff3cd;
    color: #856404;
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: 8px;
}

.empty-state {
    text-align: center;
    color: #999;
    padding: 50px 0;
}
</style>