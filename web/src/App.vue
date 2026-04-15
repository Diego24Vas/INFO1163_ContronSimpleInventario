<script setup>
import sidebar from './components/sidebar.vue'
</script>

<template>
  <div class="app-layout">
    <sidebar @search="handleSearch" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  background: var(--bg-primary);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 250px;
  }

  .sidebar {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .app-layout {
    flex-direction: column;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
