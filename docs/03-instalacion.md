# 03. Instalación y preparación del entorno

## Requisitos previos

- **Node.js + npm** (recomendado LTS).
- **Docker Desktop** (abierto y funcionando para levantar PostgreSQL en local).
- **Git** (para clonar el repositorio).

> Nota: el repositorio está dividido en `backend/` (API) y `frontend/` (PWA).

## Estructura del proyecto

- `backend/`: Express + TypeScript + TypeORM.
- `frontend/`: Angular + Tailwind + PWA.
- `docker-compose.yml`: PostgreSQL 15 para desarrollo local.

## Arranque rápido (4 pasos)

### 1) Clonar el repositorio

```bash
git clone https://github.com/Trevictus/trazapiezas.git
cd trazapiezas
```

### 2) Crear archivo `.env` en backend

```bash
cd backend
cp .env.example .env
cd ..
```

> El archivo `.env.example` contiene las variables predefinidas para desarrollo local.

### 3) Instalar dependencias y arrancar (desde la raíz)

Con **Docker Desktop abierto**, ejecuta:

```bash
npm install
npm run dev
```

Esto levantará:

- **PostgreSQL 15** en un contenedor Docker (host: `localhost`, puerto: `5432`)
- **Backend** en `http://localhost:3000`
- **Frontend** en `http://localhost:4200`

> `npm run dev` está configurado como script en la raíz para ejecutar ambas aplicaciones simultáneamente.

### 4) Acceder a la aplicación

- **Frontend**: `http://localhost:4200`
- **Backend (Healthcheck)**: `http://localhost:3000/test`
- **Swagger**: `http://localhost:3000/api-docs`

**Credenciales iniciales (autogeneradas)**

El backend crea automáticamente un usuario administrador en el primer arranque:

- Usuario: `admin`
- Contraseña: `admin123`

> Recomendación: cambiar la contraseña tras el primer login en un entorno real.

## Variables de entorno

### Backend

El backend soporta dos modos de conexión a BD:

1) **Producción (Railway)**: si existe `DATABASE_URL`, la usa directamente.
2) **Local**: si no existe `DATABASE_URL`, usa variables `DB_*` con *defaults* compatibles con Docker.

Variables relevantes:

- `PORT`: puerto del servidor (por defecto `3000`).
- `JWT_SECRET`: secreto para firmar/verificar JWT.
- `DATABASE_URL`: conexión PostgreSQL completa (modo producción).
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: modo local.
- `TALLERGP_API_KEY`: habilita consulta real a TallerGP (si no está, funciona con mock local).

### Frontend

- `frontend/src/environments/environment.development.ts`: URLs para desarrollo.
- `frontend/src/environments/environment.ts`: URLs para producción.

## Verificación rápida (checklist)

1) Backend vivo:

```bash
curl http://localhost:3000/test
```

2) Swagger accesible: abrir `http://localhost:3000/api-docs`.

3) Login (con usuario seed):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

## Problemas habituales

- **CORS bloqueando peticiones**: el backend limita orígenes permitidos. En producción hay que alinear la URL real del frontend con la lista de `origin`.
- **401 continuos en el frontend**: token expirado o inválido → limpiar `localStorage` y volver a iniciar sesión.
- **Service Worker**: solo se habilita en build de producción. Si hay caché agresiva, recargar con “hard refresh”.
- **Docker no inicia**: asegúrate de que Docker Desktop está abierto y ejecutándose.
- **npm run dev no funciona**: confirma que existe un script `dev` en `package.json` (raíz), o ejecuta manualmente en terminales separadas:
  - Terminal 1 (backend): `cd backend && npm run dev`
  - Terminal 2 (frontend): `cd frontend && npm start`

## Próximos pasos

1. Accede a `http://localhost:4200` en tu navegador.
2. Inicia sesión con `admin` / `admin123`.
3. Explora el dashboard y las funcionalidades descritas en [09-manual-usuario.md](09-manual-usuario.md).
4. Para desarrollo, consulta las decisiones técnicas en [06-desarrollo.md](06-desarrollo.md).
5. Para pruebas con matrículas mock usa si es necesario las siquientes matrículas:
```ts
const MOCK_VEHICLES: { [key: string]: ExternalVehicleData } = {
  "1234ABC": {
    brand: "PEUGEOT",
    model: "3008",
    vin: "VF3CCYM20H123456",
    engineCode: "DV6TED4",
    year: 2021
  },
  "5678XYZ": {
    brand: "RENAULT",
    model: "CLIO",
    vin: "VF1AJ200456789012",
    engineCode: "K7M690",
    year: 2019
  },
  "9012DEF": {
    brand: "CITROËN",
    model: "C3",
    vin: "VR7CCSKZ032456789",
    engineCode: "TU3JP",
    year: 2020
  }
};
```
