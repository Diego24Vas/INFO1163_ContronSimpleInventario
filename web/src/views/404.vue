<template>
  <div class="error-page">
    <div class="error-container">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Página no encontrada</h2>
      <p class="error-message">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
};
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
  color: #333;
  font-family: Arial, sans-serif;
  text-align: center;
}

.error-container {
  max-width: 600px;
  padding: 20px;
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  margin: 0;
  color: #ff6b6b;
}

.error-title {
  font-size: 2rem;
  margin: 10px 0;
}

.error-message {
  font-size: 1.2rem;
  color: #666;
}
</style>