
# Instalación y ejecución del proyecto

## 1. Instalar dependencias

Ubícate dentro de la carpeta `web/` e instala los módulos definidos en `package.json`.

```bash
cd web
npm install
```

---

## 2. Ejecutar Supabase localmente

Desde la carpeta `web/` puedes iniciar o detener los servicios de Supabase.

### Iniciar Supabase

```bash
npx supabase start
```

Accede a la aplicación en:


```
http://127.0.0.1:54323
```

### Detener Supabase

```bash
npx supabase stop
```

---

## 3. Ejecutar el frontend con Docker

Ubícate en el mismo directorio donde se encuentra el archivo `docker-compose.yml`.

### Levantar los servicios

```bash
docker compose up --build
```

Accede al servicio en:

```
http://localhost:3000/
```

### Detener los servicios

```bash
docker compose down
```

---

## Requisitos

Asegúrate de tener instalados:

- Node.js
- npm
- Docker
- Docker Compose
