# Etapa única: Entorno de desarrollo para Vue.js con Vite
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto que usa Vite
EXPOSE 3000

# Comando por defecto para iniciar el servidor de desarrollo
CMD ["npm", "run", "dev"]
