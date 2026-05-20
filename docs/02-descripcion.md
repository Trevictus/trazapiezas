# 02. Descripción funcional del sistema

## Visión general

Trazapiezas separa claramente cliente y servidor:

- **Frontend (Angular + Tailwind)**: interfaz mobile-first, navegación por secciones y utilidades de PDF/QR.
- **Backend (Express + TypeORM)**: API REST con autenticación JWT, reglas de negocio (stock/trazabilidad) y persistencia en PostgreSQL.

La aplicación se organiza alrededor de tres recursos principales: **piezas**, **movimientos** y **estanterías**, con **usuarios** para control de acceso.

## Roles y permisos

En el backend existen dos roles: `ADMIN` y `MECHANIC`. Algunas rutas están protegidas explícitamente con middleware de rol.

| Rol | Permisos funcionales principales |
| --- | --- |
| `ADMIN` | Alta/edición/baja de piezas, gestión de estanterías, gestión de personal (usuarios) y operaciones completas de inventario (incl. entradas de stock). |
| `MECHANIC` | Consulta de inventario, registro de salidas/instalación (`USED`) y consulta de histórico por matrícula. |

Nota: aunque el frontend muestre/oculte opciones según rol, la seguridad real se aplica en el backend mediante `checkToken` y `checkRole([...])`.

## Navegación y pantallas (frontend)

La aplicación usa rutas hijas bajo el contenedor “Home” y un menú inferior fijo para moverse entre secciones.

| Pantalla | Ruta | Acceso | Qué permite |
| --- | --- | --- | --- |
| Login | `/login` | Público | Iniciar sesión y obtener token JWT. |
| Dashboard | `/dashboard` | Auth | Resumen (estadísticas + últimos movimientos + accesos rápidos). |
| Inventario | `/inventory` | Auth | Listar piezas, buscar, consultar stock y operar según rol. |
| Alta pieza | `/add-part` | Auth (ADMIN a nivel API) | Crear pieza (y asignar estantería si procede). |
| Registrar movimiento | `/register-movement/:id` | Auth | Entrada/salida para una pieza concreta, con matrícula/datos de vehículo opcionales. |
| Histórico | `/history` | Auth | Buscar por matrícula, ver movimientos y exportar a PDF. |
| Estanterías | `/warehouse` | Auth | CRUD de estanterías (ADMIN en API), generar e imprimir QR. |
| Detalle estantería | `/inventory/shelf/:id` | Auth | Ver piezas de una estantería y operar sobre ellas. |
| Perfil | `/profile` | Auth | Datos de sesión y accesos a utilidades (incl. gestión de personal si procede). |
| Personal | `/staff` | Auth (ADMIN a nivel API) | Alta/baja de usuarios, cambio de contraseña, activar/desactivar. |

## Funcionalidades principales

### 1) Autenticación y sesión

- Login con usuario/contraseña.
- El backend emite un JWT con `userId` y `role` (caducidad de 24h).
- El frontend guarda el token (y datos básicos del usuario) y lo añade automáticamente a las llamadas HTTP mediante interceptor.

### 2) Catálogo de piezas e inventario

Cada pieza incluye, como mínimo:

- `reference` (única), `brand`, `category`, `description`.
- `purchasePrice` y `stock`.
- `shelfId` opcional (ubicación en estantería).

Operaciones destacables:

- **Baja lógica**: una pieza se “elimina” marcándose como `active = false`.
- **Reactivación por referencia**: si se intenta crear una pieza con una referencia ya existente pero inactiva, el backend la reactiva.

### 3) Movimientos y reglas de negocio

Un movimiento registra:

- La pieza (`part`), el usuario (`user`), la cantidad (`quantity`) y el tipo (`status`).
- Datos opcionales del vehículo: `vehiclePlate`, `vin`, `engineCode`.
- Fecha automática (`createdAt`).

Reglas clave:

- **No stock negativo**: al registrar un movimiento `USED` (salida), el backend valida que haya stock suficiente.
- Los movimientos se usan para construir trazabilidad y auditoría (quién hizo qué y cuándo).

### 4) Trazabilidad por matrícula + exportación a PDF

- El backend permite consultar movimientos filtrados por matrícula.
- El frontend muestra resultados y genera un informe en PDF con:
  - Cabecera con fecha y nombre de empresa (`CAZAPIEZAS S.L.`).
  - Tabla de movimientos (fecha, operario, pieza, cantidad y tipo).

### 5) Gestión de estanterías + QR

- CRUD de estanterías (nombre único + descripción).
- Generación de un QR que apunta a la URL del detalle de la estantería (en el propio dominio donde se ejecuta el frontend).
- Impresión/visualización del QR en un PDF de 62x62mm.

### 6) Gestión de personal (solo ADMIN)

- Alta de usuario con rol.
- Cambio de contraseña.
- Eliminar usuario (con protección para evitar auto-eliminación).
- Activar/desactivar cuenta (`isActive`) sin borrar físicamente.

## Integración externa (TallerGP)

Para enriquecer los movimientos con datos del vehículo, el backend ofrece un endpoint de consulta por matrícula que:

- Si existe `TALLERGP_API_KEY`, consulta la API real.
- Si no existe, usa un conjunto de datos “mock” local.

El objetivo es mantener el proyecto utilizable en desarrollo sin depender de un servicio externo, y permitir el modo real cuando la API key esté disponible.

## Experiencia de usuario (UX)

- **Mobile-first**: navegación rápida, botones grandes, contraste alto.
- **Estilo “industrial core”**: base oscura + acentos (azul/naranja/verde) coherentes con Tailwind.
- **Feedback inmediato**: toasts para confirmación/error y modal de confirmación en acciones destructivas.
- **PWA**: en producción se habilita Service Worker para cachear “app shell” y assets (mejora el arranque y permite funcionar con la interfaz cargada aunque la red sea inestable). No hay cache explícita de llamadas a la API.

## Casos de uso (resumen)

1) **Entrada de stock** (ADMIN): seleccionar pieza → registrar movimiento `STOCK` → actualizar stock.

2) **Salida por reparación** (operario): seleccionar pieza → registrar `USED` → introducir matrícula (y opcionalmente VIN/código motor) → queda trazado.

3) **Consulta por matrícula** (admin/operario): buscar `1234ABC` → ver movimientos → exportar PDF.

4) **Gestión de estanterías** (admin): crear estantería → asignar piezas → generar/pegar QR para acceso rápido.

5) **Reactivación de pieza** (admin): re-registrar una referencia dada de baja → el sistema la reactiva sin duplicar.

6) **Gestión de personal** (admin): crear cuenta mecánico → activar/desactivar según necesidad → mantener control de accesos.
