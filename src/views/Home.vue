<template>
    <div class="home">
        <div class="hero-section">
        <h1>🛒 Bienvenido a Tienda Vue</h1>
        <p>Tu tienda online de tecnología</p>
        
        <div class="hero-actions">
            <router-link to="/productos" class="btn btn-primary btn-large">
            Ver Productos
            </router-link>
            <router-link to="/clientes" class="btn btn-secondary btn-large">
            Registrar Cliente
            </router-link>
        </div>
        </div>

        <div class="features">
        <div class="feature-card">
            <h3>🛍️ Productos</h3>
            <p>Explora nuestro catálogo de productos tecnológicos</p>
            <router-link to="/productos" class="btn btn-outline">Ver Catálogo</router-link>
        </div>
        
        <div class="feature-card">
            <h3>🛒 Carrito</h3>
            <p>Agrega productos y gestiona tu carrito de compras</p>
        </div>
        
        <div class="feature-card">
            <h3>👥 Clientes</h3>
            <p>Registra nuevos clientes de forma rápida y sencilla</p>
            <router-link to="/clientes" class="btn btn-outline">Registrar</router-link>
        </div>
        </div>
    </div>
</template>

<script setup>
// No necesita lógica adicional por ahora
</script>

<style scoped>
.home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.hero-section {
    text-align: center;
    padding: 60px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    margin-bottom: 40px;
}

.hero-section h1 {
    font-size: 3rem;
    margin-bottom: 16px;
}

.hero-section p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.hero-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.btn-large {
    padding: 16px 32px;
    font-size: 1.1rem;
}

.btn-primary {
    background: #28a745;
    color: white;
}

.btn-primary:hover {
    background: #218838;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border-color: white;
}

.btn-secondary:hover {
    background: white;
    color: #667eea;
}

.btn-outline {
    background: transparent;
    color: #667eea;
    border-color: #667eea;
}

.btn-outline:hover {
    background: #667eea;
    color: white;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.feature-card {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 1px solid #e9ecef;
}

.feature-card h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.5rem;
}

.feature-card p {
    color: #6c757d;
    margin-bottom: 20px;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .hero-section h1 {
        font-size: 2rem;
    }
    
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .btn-large {
        width: 100%;
        max-width: 300px;
    }
}
</style>