<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="4" app>
      <v-app-bar-title>
        <v-btn to="/" variant="text" class="text-h6">
          <v-icon left>mdi-shopping</v-icon>
          Tienda Vue
        </v-btn>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn to="/" variant="text" :class="{ 'v-btn--active': $route.name === 'home' }">
        <v-icon left>mdi-home</v-icon>
        Inicio
      </v-btn>

      <v-btn
        to="/productos"
        variant="text"
        :class="{ 'v-btn--active': $route.name === 'products' || $route.name === 'product-detail' }"
      >
        <v-icon left>mdi-shopping-outline</v-icon>
        Productos
      </v-btn>

      <v-btn
        to="/clientes"
        variant="text"
        :class="{ 'v-btn--active': $route.name === 'customers' }"
      >
        <v-icon left>mdi-account-group</v-icon>
        Clientes
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// Vuetify se encarga de todo el estilo
</script>

<style scoped>
.v-btn--active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
