<template>
    <div class="customers-view">
        <h1>👥 Gestión de Clientes</h1>
        <div class="customer-container">
            <RegistroCliente />
        </div>
    </div>
</template>

<script setup>
import RegistroCliente from '@/components/RegistroCliente.vue'
</script>

<style scoped>
.customers-view {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.customers-view h1 {
    margin-bottom: 30px;
    color: #2c3e50;
}

.customer-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
</style>