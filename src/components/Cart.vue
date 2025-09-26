<template>
    <div class="cart">
        <h2>🛒 Carrito de Compras</h2>
    
        <!-- Estado vacío -->
        <div v-if="cartItems.length === 0" class="empty-cart">
            <p>Tu carrito está vacío</p>
        </div>
    
        <!-- Lista de items del carrito -->
        <div v-else>
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <div class="item-info">
                    <h4>{{ item.nombre }}</h4>
                    <p>Precio unitario: ${{ item.precio }}</p>
                </div>
        
                <div class="item-controls">
                    <button @click="decreaseQuantity(item.id)" class="btn btn-sm">-</button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item.id)" class="btn btn-sm">+</button>
                </div>
        
                <div class="item-subtotal">
                    <p>Subtotal: ${{ item.subtotal }}</p>
                </div>
            </div>

            <!-- Total general -->
            <div class="cart-total">
                <h3>Total: ${{ totalGeneral }}</h3>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    cartItems: Array
})

const emit = defineEmits(['increase-quantity', 'decrease-quantity'])

const totalGeneral = computed(() => {
    return props.cartItems.reduce((total, item) => total + item.subtotal, 0)
})

const increaseQuantity = (itemId) => {
    emit('increase-quantity', itemId)
}

const decreaseQuantity = (itemId) => {
    emit('decrease-quantity', itemId)
}
</script>

<style scoped>
.cart {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ddd;
    height: fit-content;
    position: sticky;
    top: 20px;
}

.empty-cart {
    text-align: center;
    color: #666;
    padding: 40px 0;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.item-info h4 {
    margin: 0 0 5px 0;
}

.item-info p {
    margin: 0;
    color: #666;
}

.item-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity {
    font-weight: bold;
    min-width: 30px;
    text-align: center;
}

.btn-sm {
    padding: 5px 10px;
    font-size: 14px;
}

.item-subtotal p {
    margin: 0;
    font-weight: bold;
    color: #007bff;
}

.cart-total {
    text-align: right;
    padding: 20px 0;
    border-top: 2px solid #007bff;
    margin-top: 20px;
}

.cart-total h3 {
    margin: 0;
    color: #007bff;
}
</style>