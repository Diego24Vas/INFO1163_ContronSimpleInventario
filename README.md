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

## 4. Generación de datos aleatorios para la base de datos

El proyecto incluye scripts para generar datos aleatorios y poblar la base de datos. Esto es útil para pruebas y desarrollo.


### Requisitos previos

- Asegúrate de tener configurado el entorno de Python y las dependencias necesarias. Puedes instalar las dependencias desde el archivo `requirements.txt`:

  ```bash
  pip install -r requirements.txt
  ```


### Pasos para generar datos aleatorios

1. Navega al directorio `scripts/datosDB/`:

   ```bash
   cd scripts/datosDB
   ```
2. Ejecuta el script principal `main.py` utilizando Python:

   ```bash
   python main.py
   ```

   Este script generará datos aleatorios para las tablas principales de la base de datos, como categorías, productos, proveedores y movimientos.
3. Verifica que los datos se hayan insertado correctamente en la base de datos.

---

## 5. Limpieza de la base de datos

El proyecto también incluye un script para limpiar la base de datos, eliminando datos innecesarios o restableciendo las tablas a su estado inicial.

### Pasos para limpiar la base de datos

1. Navega al directorio `scripts/datosDB/`:

   ```bash
   cd scripts/datosDB
   ```
2. Ejecuta el script de limpieza `clean.py` utilizando Python:

   ```bash
   python clean.py
   ```
   Este script eliminará los datos existentes en las tablas y las restablecerá según sea necesario.
