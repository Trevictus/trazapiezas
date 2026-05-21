# 08. Despliegue de la aplicación web

En este apartado detallo todo el proceso de despliegue, arquitectura de red y la contenerización con Docker de la aplicación Trazapiezas, orientada a cumplir con los criterios de evaluación de los Resultados de Aprendizaje RA1, RA4 y RA5.

---

## 8.1 Arquitectura de despliegue y separación de servicios (RA1 - C1)

### Despliegue en producción (Nube)
Para el entorno de producción he optado por una arquitectura de despliegue fragmentado, separando la lógica y el ciclo de vida del frontend y del backend:
* **Frontend (PWA Angular)**: Desplegado en **Vercel** (https://trazapiezas.vercel.app). Vercel actúa como CDN sirviendo la aplicación SPA y gestionando el Service Worker.
* **Backend (API REST Express)**: Desplegado en **Railway** (https://trazapiezas-production.up.railway.app). Railway gestiona la construcción interna basada en código fuente y ejecuta el servidor NodeJS en su nube de contenedores de manera automatizada.
* **Base de datos (PostgreSQL 15)**: Instancia gestionada de forma nativa en Railway, consumida por el backend a través de la variable de entorno unificada `DATABASE_URL`.

### Entorno de desarrollo y evaluación local (Docker)
Para la ejecución, pruebas y validación en local, he implementado una arquitectura multi-contenedor aislada. He definido una red interna puenteada (`trazapiezas-network`) donde los contenedores se comunican directamente usando DNS internos de Docker.

A continuación, detallo el diagrama con el flujo de comunicaciones y puertos del sistema, tanto en el entorno de desarrollo contenerizado como en el despliegue de producción:

```mermaid
graph TD
    subgraph Entorno Local (Docker)
        BrowserLocal[Navegador Local] -->|Puerto 4200| FrontLocal[Contenedor Frontend - Nginx]
        BrowserLocal -->|Puerto 3000| BackLocal[Contenedor Backend - Express]
        BackLocal -->|Red interna: db:5432| DBLocal[(Contenedor Base de Datos - PostgreSQL)]
    end

    subgraph Entorno de Producción (Nube)
        BrowserProd[Navegador Cliente] -->|HTTPS| FrontVercel[Vercel CDN - Frontend]
        BrowserProd -->|HTTPS| BackRailway[Railway App - Backend]
        BackRailway -->|Red interna Railway| DBRailway[(Railway PostgreSQL)]
    end
```

### Justificación de servicios y comunicaciones
* **Servicio de Base de Datos (db)**: Ejecuta una imagen PostgreSQL 15, garantizando la persistencia mediante un volumen local mapeado. Escucha internamente en el puerto 5432 de la red `trazapiezas-network`.
* **Servicio de Backend (backend)**: Contenedor Express construido desde un Dockerfile local. Se comunica internamente en la red con la base de datos usando `DB_HOST=db` y el puerto 5432. Expone el puerto 3000 al sistema host para facilitar las pruebas con clientes API o herramientas locales.
* **Servicio de Frontend (frontend)**: Contenedor Nginx construido localmente. Compila Angular con la configuración de desarrollo para apuntar a la API del backend local (http://localhost:3000/api) y expone la aplicación web en el puerto 4200 del host.

---

## 8.2 Contenerización con Docker y Docker Compose (RA1 - C2)

He dockerizado completamente el entorno local asegurando la reproducibilidad del despliegue en cualquier sistema con las siguientes configuraciones:

### Dockerfile del Backend (`backend/Dockerfile`)
He creado este archivo en el directorio del backend para empaquetar la API Express. Instala las dependencias necesarias para compilar módulos como bcrypt y compila TypeScript a JavaScript:

```dockerfile
FROM node:20-alpine

# Instalar dependencias necesarias para compilar módulos nativos como bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el código fuente del backend
COPY . .

# Compilar el proyecto TypeScript a JavaScript
RUN npm run build

# Exponer el puerto del backend configurado
EXPOSE 3000

# Arrancar la aplicación en producción
CMD ["npm", "start"]
```

### Dockerfile del Frontend (`frontend/Dockerfile`)
He diseñado este Dockerfile exclusivamente para el entorno local. Utiliza un proceso multi-etapa para evitar código innecesario en la imagen final. Primero compila Angular usando la configuración de desarrollo local y luego la sirve mediante Nginx:

```dockerfile
# Etapa 1: Compilación de la aplicación Angular para entorno local
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias del frontend
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar el frontend con la configuración de desarrollo para que apunte al backend local (localhost:3000)
RUN npm run build -- --configuration=development

# Etapa 2: Servidor web Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copiar el resultado de la compilación de Angular al servidor Nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx para soportar rutas de Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Configuración del Servidor Web (`frontend/nginx.conf`)
Para asegurar que el enrutamiento interno de Angular funcione correctamente en Nginx y evitar errores 404 al recargar el navegador, he creado esta configuración:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Redireccionar errores del servidor a la página estática 50x
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Configuración de Orquestación (`docker-compose.yml`)
He integrado los tres servicios en un único archivo de orquestación en la raíz del proyecto. He definido variables de entorno claras, puertos de acceso limpios y la persistencia de los datos del gestor:

```yaml
services:
  # Servicio de Base de Datos PostgreSQL 15
  db:
    image: postgres:15
    container_name: trazapiezas_db
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: temporal123
      POSTGRES_DB: trazapiezas_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - trazapiezas-network

  # Servicio de Backend (API REST Express)
  backend:
    build: ./backend
    container_name: trazapiezas_backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USERNAME=admin
      - DB_PASSWORD=temporal123
      - DB_NAME=trazapiezas_db
      - JWT_SECRET=_clavea@infranqueable/1098/
    depends_on:
      - db
    networks:
      - trazapiezas-network

  # Servicio de Frontend (Angular + Nginx)
  frontend:
    build: ./frontend
    container_name: trazapiezas_frontend
    restart: always
    ports:
      - "4200:80"
    depends_on:
      - backend
    networks:
      - trazapiezas-network

volumes:
  postgres_data:

networks:
  trazapiezas-network:
    driver: bridge
```

### Comandos de ejecución y despliegue local
Para construir las imágenes y levantar los servicios en segundo plano, ejecuto:
```bash
docker compose up --build -d
```

Una vez levantado, compruebo el estado de los contenedores mediante el siguiente comando:
```bash
docker compose ps
```

La consola me devuelve la siguiente salida, evidenciando que los puertos están limpios y los servicios están en ejecución:
```
NAME                   IMAGE                  COMMAND                  SERVICE    STATUS          PORTS
trazapiezas_backend    trazapiezas-backend    "docker-entrypoint.s…"   backend    Up 31 seconds   0.0.0.0:3000->3000/tcp
trazapiezas_db         postgres:15            "docker-entrypoint.s…"   db         Up 31 seconds   0.0.0.0:5432->5432/tcp
trazapiezas_frontend   trazapiezas-frontend   "/docker-entrypoint.…"   frontend   Up 30 seconds   0.0.0.0:4200->80/tcp
```

![Contenedores en estado running](./img/contenedores_corriendo.png)  

---

## 8.3 Gestión de Ficheros y Artefactos (RA4 - C7)

He identificado y organizado la estructura de ficheros críticos para el despliegue del proyecto, diferenciando qué elementos residen en el repositorio, cuáles se generan dinámicamente durante el proceso de compilación y cuáles deben excluirse por motivos de seguridad:

| Artefacto / Fichero | Ubicación | Tipo / Origen | Propósito en el Despliegue | Gestión / Control de Versiones |
| :--- | :--- | :--- | :--- | :--- |
| `docker-compose.yml` | Raíz `/` | Configuración | Orquestación de multi-contenedores en local. | Incluido en el repositorio público. |
| `Dockerfile` (Backend) | `/backend/Dockerfile` | Configuración | Construcción de la imagen NodeJS de la API. | Incluido en el repositorio público. |
| `Dockerfile` (Frontend) | `/frontend/Dockerfile` | Configuración | Construcción local de Angular + Nginx. | Incluido en el repositorio público (solo entorno local). |
| `nginx.conf` | `/frontend/nginx.conf` | Configuración | Enrutamiento SPA en Nginx para desarrollo local. | Incluido en el repositorio público. |
| `.env.example` | `/backend/.env.example` | Plantilla | Variables de entorno requeridas por el backend. | Incluido en el repositorio público (sin valores reales). |
| `.env` | `/backend/.env` | Configuración | Variables de entorno y secretos reales del backend. | Excluido de Git mediante `.gitignore` (seguridad). |
| `vercel.json` | Raíz `/` | Configuración | Enrutamiento de la SPA para despliegue en Vercel. | Incluido en el repositorio público. |
| `dist/` (Backend) | `/backend/dist/` | Generado | Archivos compilados en JavaScript de la API. | Excluido de Git. Se genera automáticamente en la fase de build. |
| `dist/` (Frontend) | `/frontend/dist/` | Generado | Compilación en estático de la aplicación Angular. | Excluido de Git. Se genera automáticamente en la fase de build. |
| `postgres_data` | Volumen Docker | Persistente | Datos físicos de la base de datos PostgreSQL local. | Excluido de Git. Persistido localmente por el volumen Docker. |

---

**Gestión de imágenes:** En el entorno local, las imágenes se etiquetan dinámicamente como `trazapiezas-backend` y `trazapiezas-frontend` mediante Docker Compose en su versión local. Para el entorno de producción en la nube, no se gestiona un registro (registry) externo público por motivos de privacidad del modelo de negocio; Railway y Vercel se encargan de compilar de forma aislada los artefactos directamente desde el código fuente proporcionado por el control de versiones.


## 8.4 Verificación de red del despliegue (RA5 - C8)

He verificado el comportamiento de la red tanto en local como en producción con pruebas reproducibles para validar el flujo de comunicaciones.

### 1. Comprobación de conectividad local (curl)
Realizo una petición HTTP HEAD al endpoint de diagnóstico del backend para comprobar que está activo y devuelve el estado 200 OK:
```bash
curl -I http://localhost:3000/test
```
Respuesta obtenida:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: text/html; charset=utf-8
Content-Length: 26
ETag: W/"1a-5igTHVfq83lKHkMrv6wjVHKfj4Q"
Date: Thu, 21 May 2026 07:34:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

Verifico que la API autentica correctamente a un usuario utilizando el usuario administrador creado en el arranque:
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```
Respuesta obtenida:
```json
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3OTM0ODkwMywiZXhwIjoxNzc5NDM1MzAzfQ.YvsOooIUarClZ-M9qlnfoE5iL63i-UJ3N__KdS9xdZI","user":{"id":5,"username":"admin","role":"ADMIN"}}
```

Realizo una comprobación similar en el frontend local servido por Nginx en el puerto 4200:
```bash
curl -I http://localhost:4200/
```
Respuesta obtenida:
```
HTTP/1.1 200 OK
Server: nginx/1.31.0
Date: Thu, 21 May 2026 07:34:46 GMT
Content-Type: text/html
Content-Length: 661
Last-Modified: Thu, 21 May 2026 07:33:29 GMT
Connection: keep-alive
ETag: "6a0eb549-295"
Accept-Ranges: bytes
```

### 2. Comprobación de conectividad en producción (curl)
Compruebo que la API backend y el frontend responden adecuadamente en sus servidores en la nube:
```bash
curl -I https://trazapiezas-production.up.railway.app/test
```
Respuesta obtenida:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: text/html; charset=utf-8
...
```

```bash
curl -I https://trazapiezas.vercel.app/
```
Respuesta obtenida:
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
...
```

### 3. Configuración CORS en Express
Para permitir la comunicación segura entre el frontend y el backend, y restringir accesos no autorizados en navegadores, he configurado CORS en el backend (`backend/src/index.ts`) especificando los orígenes permitidos:
```typescript
app.use(cors({
  origin: [
    'http://localhost:4200', 
    'https://trazapiezas.vercel.app'
  ],
  credentials: true
}));
```

### 4. Interconexión interna entre el Backend y la Base de Datos (Logs)
Inspecciono los logs de la base de datos mediante el comando `docker logs trazapiezas_db`, donde compruebo que el motor arranca sin incidencias y está listo para recibir conexiones en la red local:
```
PostgreSQL Database directory appears to contain a database; Skipping initialization

2026-05-21 07:33:45.448 UTC [1] LOG:  starting PostgreSQL 15.16 (Debian 15.16-1.pgdg13+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
2026-05-21 07:33:45.448 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2026-05-21 07:33:45.448 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2026-05-21 07:33:45.457 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2026-05-21 07:33:45.470 UTC [29] LOG:  database system was shut down at 2026-05-21 07:33:44 UTC
2026-05-21 07:33:45.478 UTC [1] LOG:  database system is ready to accept connections
```

Verifico la conexión del backend inspeccionando los logs de `trazapiezas_backend` con `docker logs trazapiezas_backend`. Se observa cómo se inicializa la conexión con PostgreSQL, se inyectan las tablas necesarias mediante el sincronizador y se arranca el servidor Express en el puerto 3000 de forma exitosa:
```
> backend@1.0.0 start
> node dist/index.js

[dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
Intentando conectar con base de datos en producción...
🚀 Servidor en puerto 3000
query: SELECT version()
query: SELECT * FROM current_schema()
query: CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
query: START TRANSACTION
query: SELECT * FROM current_schema()
query: SELECT * FROM current_database()
query: SELECT "table_schema", "table_name", obj_description(('"' || "table_schema" || '"."' || "table_name" || '"')::regclass, 'pg_class') AS table_comment FROM "information_schema"."tables" WHERE ("table_schema" = 'public' AND "table_name" = 'users') OR ("table_schema" = 'public' AND "table_name" = 'movement') OR ("table_schema" = 'public' AND "table_name" = 'shelves') OR ("table_schema" = 'public' AND "table_name" = 'parts')
query: SELECT TRUE FROM information_schema.columns WHERE table_name = 'pg_class' and column_name = 'relispartition'
query: SELECT columns.*, pg_catalog.col_description(('"' || table_catalog || '"."' || table_schema || '"."' || table_name || '"')::regclass::oid, ordinal_position) AS description, ('"' || "udt_schema" || '"."' || "udt_name" || '"')::"regtype"::text AS "regtype", pg_catalog.format_type("col_attr"."atttypid", "col_attr"."atttypmod") AS "format_type" FROM "information_schema"."columns" LEFT JOIN "pg_catalog"."pg_attribute" AS "col_attr" ON "col_attr"."attname" = "columns"."column_name" AND "col_attr"."attrelid" = ( SELECT "cls"."oid" FROM "pg_catalog"."pg_class" AS "cls" LEFT JOIN "pg_catalog"."pg_namespace" AS "ns" ON "ns"."oid" = "cls"."relnamespace" WHERE "cls"."relname" = "columns"."table_name" AND "ns"."nspname" = "columns"."table_schema" ) WHERE ("table_schema" = 'public' AND "table_name" = 'parts') OR ("table_schema" = 'public' AND "table_name" = 'shelves') OR ("table_schema" = 'public' AND "table_name" = 'users') OR ("table_schema" = 'public' AND "table_name" = 'movement')
query: SELECT "ns"."nspname" AS "table_schema", "t"."relname" AS "table_name", "cnst"."conname" AS "constraint_name", pg_get_constraintdef("cnst"."oid") AS "expression", CASE "cnst"."contype" WHEN 'p' THEN 'PRIMARY' WHEN 'u' THEN 'UNIQUE' WHEN 'c' THEN 'CHECK' WHEN 'x' THEN 'EXCLUDE' END AS "constraint_type", "a"."attname" AS "column_name" FROM "pg_constraint" "cnst" INNER JOIN "pg_class" "t" ON "t"."oid" = "cnst"."conrelid" INNER JOIN "pg_namespace" "ns" ON "ns"."oid" = "cnst"."connamespace" LEFT JOIN "pg_attribute" "a" ON "a"."attrelid" = "cnst"."conrelid" AND "a"."attnum" = ANY ("cnst"."conkey") WHERE "t"."relkind" IN ('r', 'p') AND (("ns"."nspname" = 'public' AND "t"."relname" = 'parts') OR ("ns"."nspname" = 'public' AND "t"."relname" = 'shelves') OR ("ns"."nspname" = 'public' AND "t"."relname" = 'users') OR ("ns"."nspname" = 'public' AND "t"."relname" = 'movement'))
query: SELECT "ns"."nspname" AS "table_schema", "t"."relname" AS "table_name", "i"."relname" AS "constraint_name", "a"."attname" AS "column_name", CASE "ix"."indisunique" WHEN 't' THEN 'TRUE' ELSE'FALSE' END AS "is_unique", pg_get_expr("ix"."indpred", "ix"."indrelid") AS "condition", "types"."typname" AS "type_name", "am"."amname" AS "index_type" FROM "pg_class" "t" INNER JOIN "pg_index" "ix" ON "ix"."indrelid" = "t"."oid" INNER JOIN "pg_attribute" "a" ON "a"."attrelid" = "t"."oid"  AND "a"."attnum" = ANY ("ix"."indkey") INNER JOIN "pg_namespace" "ns" ON "ns"."oid" = "t"."relnamespace" INNER JOIN "pg_class" "i" ON "i"."oid" = "ix"."indexrelid" INNER JOIN "pg_type" "types" ON "types"."oid" = "a"."atttypid" INNER JOIN "pg_am" "am" ON "i"."relam" = "am"."oid" LEFT JOIN "pg_constraint" "cnst" ON "cnst"."conname" = "i"."relname" WHERE "t"."relkind" IN ('r', 'p') AND "cnst"."contype" IS NULL AND (("ns"."nspname" = 'public' AND "t"."relname" = 'parts') OR ("ns"."nspname" = 'public' AND "t"."relname" = 'shelves') OR ("ns"."nspname" = 'public' AND "t"."relname" = 'users') OR ("ns"."nspname" = 'public' AND "t"."relname" = 'movement'))
query: SELECT "con"."conname" AS "constraint_name", "con"."nspname" AS "table_schema", "con"."relname" AS "table_name", "att2"."attname" AS "column_name", "ns"."nspname" AS "referenced_table_schema", "cl"."relname" AS "referenced_table_name", "att"."attname" AS "referenced_column_name", "con"."confdeltype" AS "on_delete", "con"."confupdtype" AS "on_update", "con"."condeferrable" AS "deferrable", "con"."condeferred" AS "deferred" FROM ( SELECT UNNEST ("con1"."conkey") AS "parent", UNNEST ("con1"."confkey") AS "child", "con1"."confrelid", "con1"."conrelid", "con1"."conname", "con1"."contype", "ns"."nspname", "cl"."relname", "con1"."condeferrable", CASE WHEN "con1"."condeferred" THEN 'INITIALLY DEFERRED' ELSE 'INITIALLY IMMEDIATE' END as condeferred, CASE "con1"."confdeltype" WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END as "confdeltype", CASE "con1"."confupdtype" WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END as "confupdtype" FROM "pg_class" "cl" INNER JOIN "pg_namespace" "ns" ON "cl"."relnamespace" = "ns"."oid" INNER JOIN "pg_constraint" "con1" ON "con1"."conrelid" = "cl"."oid" WHERE "con1"."contype" = 'f' AND (("ns"."nspname" = 'public' AND "cl"."relname" = 'parts') OR ("ns"."nspname" = 'public' AND "cl"."relname" = 'shelves') OR ("ns"."nspname" = 'public' AND "cl"."relname" = 'users') OR ("ns"."nspname" = 'public' AND "cl"."relname" = 'movement')) ) "con" INNER JOIN "pg_attribute" "att" ON "att"."attrelid" = "con"."confrelid" AND "att"."attnum" = "con"."child" INNER JOIN "pg_class" "cl" ON "cl"."oid" = "con"."confrelid"  AND "cl"."relispartition" = 'f'INNER JOIN "pg_namespace" "ns" ON "cl"."relnamespace" = "ns"."oid" INNER JOIN "pg_attribute" "att2" ON "att2"."attrelid" = "con"."conrelid" AND "att2"."attnum" = "con"."parent"
query: SELECT "udt_schema", "udt_name" FROM "information_schema"."columns" WHERE "table_schema" = 'public' AND "table_name" = 'users' AND "column_name"='role'
query: SELECT "e"."enumlabel" AS "value" FROM "pg_enum" "e" INNER JOIN "pg_type" "t" ON "t"."oid" = "e"."enumtypid" INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" WHERE "n"."nspname" = 'public' AND "t"."typname" = 'users_role_enum'
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'typeorm_metadata'
query: COMMIT
✅ Conexión exitosa a PostgreSQL
query: SELECT COUNT(1) AS "cnt" FROM "users" "User"
🚀 Servidor en puerto 3000
query: SELECT "User"."id" AS "User_id", "User"."username" AS "User_username", "User"."password" AS "User_password", "User"."role" AS "User_role", "User"."isActive" AS "User_isActive" FROM "users" "User" WHERE (("User"."username" = $1)) LIMIT 1 -- PARAMETERS: ["admin"]
```

![Logs](./img/logs_conexion.png)  


![Evidencia Frontend en la nube](./img/panel_vercel.png)  
![Evidencia Backend y BBDD en la nube](./img/panel_railway.png)