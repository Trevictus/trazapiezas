# Trazapiezas - Sistema de Trazabilidad de Stock (Backend API)
Trazapiezas es una solución Mobile First diseñada para resolver la falta de control de inventario en talleres mecánicos. Este backend gestiona de forma inteligente el flujo de piezas desde su entrada por albarán hasta su montaje final en un vehículo, garantizando la trazabilidad total mediante matrícula.

## 🧱 Stack Tecnológico

| Tecnología            | Propósito                                                        |
|----------------------|------------------------------------------------------------------|
| **Node.js & Express 5** | Entorno de ejecución y framework para la API REST.              |
| **TypeScript 5.9**      | Tipado estático para un desarrollo más robusto y seguro.        |
| **PostgreSQL 15**       | Base de datos relacional que garantiza integridad de datos.     |
| **TypeORM 0.3.x**       | ORM para gestionar entidades, relaciones y migraciones.         |
| **Docker & Docker Compose** | Contenerización de la infraestructura y la base de datos. |
| **JWT & Bcrypt**        | Autenticación segura y encriptación de contraseñas.             |

## Instalación y Configuración  
Sigue estos pasos para levantar el entorno de desarrollo:  
- **Clonar el repositorio e instalar dependencias:**
```bash
npm install
```
- **Levantar la base de datos (Docker):**
```bash
docker-compose up -d
```
- **Configurar el entorno:**  
Crea un archivo .env en la raíz de backend/ con las credenciales de la base de datos y la clave JWT_SECRET.  
- **Arrancar el servidor:**  
```bash
npm run dev
```
La API estará escuchando en http://localhost:3000.

## Características Principales

### 1. Control de Stock Inteligente
El sistema incluye una validación que impide el **stock negativo**.  
Antes de registrar el uso de una pieza, la API verifica las existencias; si son insuficientes, devuelve un **error 400 (Bad Request)**.

### 2. Seguridad Basada en Roles (RBAC)
Acceso protegido mediante **JSON Web Tokens (JWT)**. Se distinguen los siguientes perfiles:

- **ADMIN**: Gestión del catálogo (Crear, Editar, Borrar).  
- **MECHANIC**: Consulta de stock y registro de movimientos.

### 3. Trazabilidad por Matrícula
Permite recuperar el **historial completo de piezas instaladas** en un vehículo específico mediante el buscador de movimientos por matrícula.

### 4. Documentación y Estandarización
- **Swagger UI**: Interfaz interactiva disponible en `/api-docs`.  
- **Middleware de Errores**: Respuestas JSON estandarizadas para facilitar la integración con la futura PWA.

## Estructura del Proyecto

- `src/entities/`
Modelos de datos principales:  
**User**, **Part** y **Movement**

- `src/controllers/`
Contiene la **lógica de negocio** y los **controladores** que gestionan las peticiones de la API.

- `src/middleware/` Incluye:  
Filtros de **seguridad** y gestión centralizada de **errores**

- `src/data-source.ts`
Archivo de configuración para la conexión con **PostgreSQL** mediante TypeORM.

## Plan de Ejecución y Progresos

### Sprint 1: Cimientos y Arquitectura (Semanas 1 y 2)
**Estado:** Completado

#### Configuración de Infraestructura
- Despliegue de contenedores mediante Docker para PostgreSQL 15.

#### Modelado de Datos
- Definición de entidades User, Part y Movement con TypeORM.

#### Sistema de Autenticación
- Implementación de registro y login con Bcrypt y JWT.

#### Arquitectura Base
- Estructura de carpetas bajo el patrón Controlador-Entidad.

---

### Sprint 2: Blindaje de API e Integración (Semanas 3 y 4)
**Estado:** Finalizado / Validando

#### Seguridad por Roles
- Restricción de acciones sensibles mediante el middleware checkRole.

#### Control de Stock
- Validación en MovementController para impedir stock negativo.

#### Buscador de Trazabilidad
- Endpoint para recuperar movimientos vinculados a una matrícula.

#### Estandarización
- Middleware global de errores para asegurar respuestas JSON consistentes.

#### CORS e Integración
- Configuración de acceso para la PWA y documentación interactiva.