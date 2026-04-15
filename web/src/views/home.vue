<template>
  <div class="home">
    <div class="container">
      <div class="buscador-wrapper">
        <buscador @search="handleSearch" />
      </div>
    </div>
  </div>
</template>

<script setup>
import buscador from '../components/buscador.vue'

const handleSearch = (query) => {
  console.log('Búsqueda:', query)
}
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--spacing-xl);
  background: var(--bg-primary);
  min-height: 100vh;
}

.container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--spacing-md);
}

.buscador-wrapper {
  grid-column: 2 / 4;
}

/* Estilos para componentes PrimeVue */
:deep(.p-inputgroup) {
  background-color: white;
  border-radius: var(--radius-md);
  border: 1px solid #d0d0d0;
  overflow: hidden;
}

:deep(.p-inputtext) {
  background-color: white;
  color: black;
  border: none;
  padding: var(--spacing-md);
}

:deep(.p-inputtext::placeholder) {
  color: var(--text-muted);
}

:deep(.p-inputtext:focus) {
  box-shadow: none;
}

:deep(.p-button) {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: var(--spacing-md);
}

:deep(.p-button:hover) {
  background-color: #1d4ed8;
}
</style>
