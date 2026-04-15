<template>
  <div class="buscador">
    <InputGroup>
      <InputText 
        v-model="search"
        :placeholder="placeholder"
        @input="handleSearch"
      />
      <Button>
        <i :class="icon"></i>
      </Button>
    </InputGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

defineProps({
  icon: {
    type: String,
    default: 'fa-solid fa-magnifying-glass'
  },
  placeholder: {
    type: String,
    default: 'Buscar'
  }
})

const search = ref('')

const handleSearch = () => {
  emit('search', search.value)
}

const emit = defineEmits(['search'])
</script>

<style scoped>
.buscador {
  width: 100%;
}

:deep(.p-inputgroup) {
  background-color: white;
}

:deep(.p-inputtext) {
  background-color: white;
  border-color: #d0d0d0;
}

:deep(.p-inputtext:focus) {
  background-color: white;
  border-color: #d0d0d0;
  box-shadow: none;
}

:deep(.p-button) {
  background-color: white;
  border-color: #d0d0d0;
  color: #666;
  cursor: default;
  pointer-events: none;
}
</style>
