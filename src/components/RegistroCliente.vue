<template>
  <div class="registro-card">
    <h2 class="titulo">🏪 Registro Rápido de Cliente</h2>
    
    <div class="form-group">
      <label for="nombreCliente" class="label">
        Nombre del Cliente:
      </label>
      <input
        id="nombreCliente"
        v-model="nombreCliente"
        type="text"
        placeholder="Ingrese el nombre del cliente..."
        :class="{ 
          'input-nombre': true,
          'input-valid': isNameValid && nombreCliente.length > 0,
          'input-invalid': nombreCliente.length > 0 && !isNameValid,
          'input-neutral': nombreCliente.length === 0
        }"
        @keyup.enter="registrarCliente"
      />
      
      <!-- Mensaje de error cuando el nombre es muy corto -->
      <div v-if="nombreCliente.length > 0 && !isNameValid" class="error-message">
        ⚠️ El nombre debe tener al menos 3 caracteres
      </div>
      
      <!-- Mensaje de éxito cuando el nombre es válido -->
      <div v-else-if="isNameValid && nombreCliente.length > 0" class="success-message">
        ✅ Nombre válido
      </div>
    </div>

    <!-- Botón con estado dinámico -->
    <button 
      @click="registrarCliente"
      :disabled="!isNameValid"
      :class="{
        'btn-registrar': true,
        'btn-enabled': isNameValid,
        'btn-disabled': !isNameValid
      }"
    >
      {{ isNameValid ? 'Registrar Cliente' : 'Nombre debe tener 3+ caracteres' }}
    </button>

    <!-- Mensaje de confirmación después del registro -->
    <div v-if="mostrarConfirmacion" class="confirmacion">
      <div class="mensaje-bienvenida">
        <h3>🎉 ¡Bienvenido, {{ clienteRegistrado }}!</h3>
        <p>Tu registro ha sido completado exitosamente.</p>
        <small>Cliente guardado en el sistema</small>
      </div>
    </div>

    <!-- Lista de clientes registrados -->
    <div v-if="clientesRegistrados.length > 0" class="lista-clientes">
      <h4>Clientes registrados hoy:</h4>
      <ul>
        <li v-for="(cliente, index) in clientesRegistrados" :key="index">
          {{ cliente.nombre }} - {{ cliente.hora }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistroCliente',
  data() {
    return {
      nombreCliente: '',
      mostrarConfirmacion: false,
      clienteRegistrado: '',
      clientesRegistrados: []
    }
  },
  computed: {
    // Computed para validar si el nombre tiene 3+ caracteres
    isNameValid() {
      return this.nombreCliente.trim().length >= 3;
    }
  },
  methods: {
    registrarCliente() {
      if (!this.isNameValid) {
        return; // No hacer nada si el nombre no es válido
      }

      // Simular guardado en "base de datos"
      const cliente = {
        nombre: this.nombreCliente.trim(),
        hora: new Date().toLocaleTimeString(),
        fecha: new Date().toLocaleDateString()
      };

      console.log('🔄 Guardando cliente en base de datos:', cliente);
      
      // Agregar a la lista local
      this.clientesRegistrados.push(cliente);

      // Guardar el nombre para el mensaje de bienvenida
      this.clienteRegistrado = this.nombreCliente.trim();
      
      // Mostrar confirmación
      this.mostrarConfirmacion = true;

      // Limpiar el campo después de un momento
      setTimeout(() => {
        this.nombreCliente = '';
        this.mostrarConfirmacion = false;
        this.clienteRegistrado = '';
      }, 4000);

      console.log('✅ Cliente registrado exitosamente');
      console.log('📊 Total de clientes hoy:', this.clientesRegistrados.length);
    }
  }
}
</script>

<style scoped>
.registro-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.titulo {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

/* ESTILOS DINÁMICOS PARA EL INPUT SEGÚN VALIDEZ */
.input-nombre {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* Input neutro (sin contenido) */
.input-neutral {
  border-color: #e1e5e9;
  background-color: white;
}

/* Input válido (3+ caracteres) */
.input-valid {
  border-color: #28a745 !important;
  background-color: #f8fff9 !important;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
}

/* Input inválido (< 3 caracteres) */
.input-invalid {
  border-color: #dc3545 !important;
  background-color: #fff5f5 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.input-nombre:focus {
  outline: none;
}

/* MENSAJES DE VALIDACIÓN */
.error-message {
  color: #dc3545;
  font-size: 14px;
  background: #f8d7da;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  margin-top: 8px;
  animation: slideIn 0.3s ease;
}

.success-message {
  color: #155724;
  font-size: 14px;
  background: #d4edda;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
  margin-top: 8px;
  animation: slideIn 0.3s ease;
}

/* BOTÓN CON ESTADOS DINÁMICOS */
.btn-registrar {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Botón habilitado */
.btn-enabled {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-enabled:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

/* Botón deshabilitado */
.btn-disabled {
  background: #6c757d;
  color: #fff;
  cursor: not-allowed;
  opacity: 0.6;
}

.confirmacion {
  margin-top: 20px;
  animation: slideIn 0.5s ease;
}

.mensaje-bienvenida {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.mensaje-bienvenida h3 {
  margin: 0 0 10px 0;
  color: #155724;
  font-size: 1.3em;
}

.mensaje-bienvenida p {
  margin: 10px 0;
  color: #155724;
  font-weight: 500;
}

.mensaje-bienvenida small {
  color: #6c757d;
}

.lista-clientes {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.lista-clientes h4 {
  color: #333;
  margin-bottom: 10px;
}

.lista-clientes ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lista-clientes li {
  padding: 8px 12px;
  background: #f8f9fa;
  margin-bottom: 5px;
  border-radius: 5px;
  font-size: 14px;
  color: #555;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .registro-card {
    padding: 20px;
    width: 95%;
  }
  
  .titulo {
    font-size: 1.3rem;
  }
}
</style>