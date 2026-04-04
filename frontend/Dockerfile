# Etapa 1: Construcción de la aplicación Vue.js
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:1.25-alpine AS production

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración de Nginx si es necesario (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
