<template>
    <div id="app">
        <header class="app-header">
        <div class="header-content">
            <router-link to="/" class="logo">
            🛒 Tienda Vue
            </router-link>
            
            <nav class="main-nav">
            <router-link 
                to="/" 
                class="nav-link"
                :class="{ 'router-link-active': $route.name === 'home' }"
            >
                🏠 Inicio
            </router-link>
            <router-link 
                to="/productos" 
                class="nav-link"
                :class="{ 'router-link-active': $route.name === 'products' || $route.name === 'product-detail' }"
            >
                🛍️ Productos
            </router-link>
            <router-link 
                to="/clientes" 
                class="nav-link"
                :class="{ 'router-link-active': $route.name === 'customers' }"
            >
                👥 Clientes
            </router-link>
            </nav>
        </div>
        </header>
        
        <main class="main-content">
        <router-view />
        </main>
    </div>
</template>

<script setup>
// No necesita lógica adicional
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#app {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background: #f8f9fa;
}

.app-header {
    background: #2c3e50;
    color: white;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
}

.logo:hover {
    color: #74b9ff;
}

.main-nav {
    display: flex;
    gap: 20px;
}

.nav-link {
    padding: 10px 16px;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #74b9ff;
}

/* Estilos para enlaces activos */
.nav-link.router-link-active {
    background: #74b9ff;
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: calc(100vh - 80px);
}

/* Responsive */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
    }
    
    .main-nav {
        gap: 10px;
    }
    
    .nav-link {
        padding: 8px 12px;
        font-size: 14px;
    }
    
    .main-content {
        padding: 15px;
    }
}
</style>