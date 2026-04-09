<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import ToggleButton from 'primevue/togglebutton'

const toast = useToast()

const nombre = ref('')
const edad = ref(null)
const mensaje = ref('')
const showDialog = ref(false)
const isActive = ref(false)

const mostrarMensaje = () => {
  if (nombre.value && edad.value) {
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito!', 
      detail: `Hola ${nombre.value}, tienes ${edad.value} años`, 
      life: 3000 
    })
  } else {
    toast.add({ 
      severity: 'warn', 
      summary: 'Advertencia', 
      detail: 'Por favor completa todos los campos', 
      life: 3000 
    })
  }
}

const mostrarMensajeError = () => {
  toast.add({ 
    severity: 'error', 
    summary: 'Error', 
    detail: 'Algo salió mal', 
    life: 3000 
  })
}

const mostrarDialogo = () => {
  showDialog.value = true
}

const enviarMensaje = () => {
  if (mensaje.value.trim()) {
    toast.add({ 
      severity: 'info', 
      summary: 'Mensaje Enviado', 
      detail: `Tu mensaje: "${mensaje.value}"`, 
      life: 3000 
    })
    mensaje.value = ''
    showDialog.value = false
  }
}

const limpiarFormulario = () => {
  nombre.value = ''
  edad.value = null
  mensaje.value = ''
  isActive.value = false
  toast.add({ 
    severity: 'info', 
    summary: 'Formulario Limpiado', 
    detail: 'Todos los campos han sido resetados', 
    life: 2000 
  })
}

const cambiarEstadoToggle = (value) => {
  const estado = value ? 'Activado' : 'Desactivado'
  toast.add({ 
    severity: 'info', 
    summary: `Estado: ${estado}`, 
    detail: `El toggle ha sido ${estado}`, 
    life: 2000 
  })
}
</script>

<template>
  <div class="container">
    <Toast />
    
    <Card class="card-title">
      <template #title>
        <h1>Prueba de Componentes PrimeVue</h1>
      </template>
      <template #content>
        <p>Bienvenido a la demostración de componentes PrimeVue con Vue 3</p>
      </template>
    </Card>

    <Card class="card-form">
      <template #title>
        <h2>Formulario de Prueba</h2>
      </template>
      <template #content>
        <div class="form-group">
          <label for="nombre" class="label">Nombre:</label>
          <InputText 
            id="nombre"
            v-model="nombre" 
            placeholder="Ingresa tu nombre"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="edad" class="label">Edad:</label>
          <InputNumber 
            id="edad"
            v-model="edad" 
            placeholder="Ingresa tu edad"
            :min="0" 
            :max="120"
            class="input-field"
          />
        </div>

        <div class="button-group">
          <Button 
            label="Enviar" 
            icon="pi pi-check"
            @click="mostrarMensaje"
            class="button-primary"
          />
          <Button 
            label="Limpiar" 
            icon="pi pi-times"
            severity="secondary"
            @click="limpiarFormulario"
            class="button-secondary"
          />
          <Button 
            label="Error de Prueba" 
            icon="pi pi-exclamation-circle"
            severity="danger"
            @click="mostrarMensajeError"
            class="button-danger"
          />
        </div>
      </template>
    </Card>

    <Card class="card-textarea">
      <template #title>
        <h2>Área de Mensaje</h2>
      </template>
      <template #content>
        <div class="form-group">
          <label for="mensaje" class="label">Escribe un mensaje:</label>
          <Textarea 
            id="mensaje"
            v-model="mensaje" 
            rows="4"
            placeholder="Escribe aquí tu mensaje..."
            class="textarea-field"
          />
        </div>

        <Button 
          label="Abrir Diálogo" 
          icon="pi pi-window-maximize"
          @click="mostrarDialogo"
          class="button-primary mt-2"
        />
      </template>
    </Card>

    <Card class="card-toggle">
      <template #title>
        <h2>Toggle de Control</h2>
      </template>
      <template #content>
        <div class="toggle-group">
          <span class="toggle-label">Estado del Sistema:</span>
          <ToggleButton 
            v-model="isActive"
            onLabel="Activado"
            offLabel="Desactivado"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            @change="cambiarEstadoToggle"
            class="toggle-button"
          />
          <span class="toggle-status">
            {{ isActive ? '✓ Activado' : '✗ Desactivado' }}
          </span>
        </div>
      </template>
    </Card>

    <!-- Diálogo Modal -->
    <Dialog 
      v-model:visible="showDialog" 
      header="Enviar Mensaje" 
      :modal="true"
      :style="{ width: '50vw' }"
    >
      <div class="dialog-content">
        <p>Mensaje a enviar:</p>
        <p class="message-preview">{{ mensaje || '(vacío)' }}</p>
      </div>
      <template #footer>
        <Button 
          label="Cancelar" 
          icon="pi pi-times"
          @click="showDialog = false"
          class="p-button-text"
        />
        <Button 
          label="Enviar" 
          icon="pi pi-check"
          @click="enviarMensaje"
          class="p-button-success"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.card-title {
  margin-bottom: 30px;
  background: white !important;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-title h1 {
  margin: 0;
  color: #667eea;
}

.card-form,
.card-textarea,
.card-toggle {
  margin-bottom: 20px;
  background: white !important;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-form h2,
.card-textarea h2,
.card-toggle h2 {
  color: #667eea;
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.input-field,
.textarea-field {
  width: 100% !important;
  padding: 10px 12px !important;
  border-radius: 4px !important;
  border: 1px solid #e0e0e0 !important;
  font-size: 0.95rem;
}

.input-field:focus,
.textarea-field:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.button-primary,
.button-secondary,
.button-danger {
  flex: 1;
  min-width: 120px;
  padding: 10px 20px !important;
  border-radius: 4px !important;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-primary {
  background: #667eea !important;
  color: white !important;
  border: none !important;
}

.button-primary:hover {
  background: #5568d3 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.button-secondary {
  background: #f0f0f0 !important;
  color: #333 !important;
}

.button-secondary:hover {
  background: #e0e0e0 !important;
}

.button-danger {
  background: #ff6b6b !important;
  color: white !important;
}

.button-danger:hover {
  background: #ee5a52 !important;
}

.mt-2 {
  margin-top: 15px;
}

.toggle-group {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.toggle-label {
  font-weight: 600;
  color: #333;
}

.toggle-button {
  width: 100px;
}

.toggle-status {
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 4px;
  background: white;
  color: #667eea;
  font-size: 0.9rem;
}

.dialog-content {
  padding: 10px 0;
}

.message-preview {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  border-left: 4px solid #667eea;
  min-height: 60px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
