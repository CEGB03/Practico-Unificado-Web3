<template>
    <div>
        <h1>Products</h1>
        
        <div class="main-layout">
            <!-- Columna izquierda - Lista de productos -->
            <div class="products-section">
                <ProductList 
                    :products="products" 
                    @add-to-cart="handleAddToCart"
                />
            </div>
            
            <!-- Columna derecha - Carrito -->
            <div class="cart-section">
                <Cart 
                    :cart-items="cartItems"
                    @increase-quantity="increaseQuantity"
                    @decrease-quantity="decreaseQuantity"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import ProductList from '@/components/ProductList.vue'
import Cart from '@/components/Cart.vue'
import { ref, computed } from 'vue'

// Datos de productos
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

// Estado del carrito
const cart = ref([])

// Computed para los items del carrito con subtotales
const cartItems = computed(() => {
    return cart.value.map(item => {
        const product = products.value.find(p => p.id === item.productId)
        return {
        id: item.productId,
        nombre: product.nombre,
        precio: product.precio,
        quantity: item.quantity,
        subtotal: product.precio * item.quantity
        }
    })
})

const handleAddToCart = (productId) => {
    const product = products.value.find(p => p.id === productId)
    const existingItem = cart.value.find(item => item.productId === productId)
    
    // Verificar si hay stock disponible
    if (product.stock <= 0) {
        alert('No hay stock disponible para este producto')
        return
    }
    
    if (existingItem) {
        // Verificar si se puede agregar más cantidad
        if (product.stock > 0) {
            existingItem.quantity += 1
            product.stock -= 1 // Reducir stock disponible
        } else {
            alert('No hay más stock disponible para este producto')
            return
        }
    } else {
        // Agregar nuevo item al carrito
        cart.value.push({
            productId: productId,
            quantity: 1
        })
        product.stock -= 1 // Reducir stock disponible
    }
    
    console.log(`Producto ${product.nombre} agregado. Stock restante: ${product.stock}`)
}

const increaseQuantity = (productId) => {
    const item = cart.value.find(item => item.productId === productId)
    const product = products.value.find(p => p.id === productId)
    
    if (item && product) {
        // Verificar si hay stock disponible
        if (product.stock > 0) {
            item.quantity += 1
            product.stock -= 1 // Reducir stock disponible
            console.log(`Cantidad aumentada. Stock restante de ${product.nombre}: ${product.stock}`)
        } else {
            alert(`No hay más stock disponible para ${product.nombre}`)
        }
    }
}

const decreaseQuantity = (productId) => {
    const item = cart.value.find(item => item.productId === productId)
    const product = products.value.find(p => p.id === productId)
    
    if (item && product) {
        item.quantity -= 1
        product.stock += 1 // Restaurar stock disponible
        
        console.log(`Cantidad reducida. Stock restaurado de ${product.nombre}: ${product.stock}`)
        
        // Eliminar el item si la cantidad llega a 0
        if (item.quantity === 0) {
            const index = cart.value.indexOf(item)
            cart.value.splice(index, 1)
        }
    }
}
</script>

<style scoped>
h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
}

.main-layout {
    display: flex;
    gap: 20px;
    min-height: 70vh;
}

.products-section {
    flex: 2;
    min-width: 0; /* Permite que se contraiga */
}

.cart-section {
    flex: 1;
    min-width: 350px;
    max-width: 400px;
}

/* Responsive: En pantallas pequeñas, hacer que sea vertical */
@media (max-width: 768px) {
    .main-layout {
        flex-direction: column;
    }
    
    .cart-section {
        min-width: auto;
        max-width: none;
    }
}
</style>