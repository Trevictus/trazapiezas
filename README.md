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

## Versión de prueba en la nube

En el siguiente link https://trazapiezas.vercel.app/ está desplegada la app, se puede acceder al rol `MECHANIC` mediante las credenciales:
- Usuario: "Santi"
- Contraseña: " _santi_tiene_moto"

## Instalación y Configuración  

Existen dos métodos para levantar el proyecto:

### Método 1: Desarrollo Local (Recomendado)

**1. Instalar y configurar dependencias:**
```bash
npm run setup
```
Este comando:
- Copia `backend/.env.example` a `backend/.env` si no existe
- Instala dependencias de la raíz
- Instala dependencias del backend y frontend en paralelo

**2. Levantar la aplicación:**
```bash
npm run dev
```
- Levanta el frontend (http://localhost:4200)
- Levanta el backend (http://localhost:3000)
- Levanta la base de datos en Docker
- Swagger disponible en http://localhost:3000/api-docs

### Método 2: Docker (Despliegue Completo)

```bash
npm run deploy
```

Levanta toda la infraestructura (Frontend, Backend y Base de Datos) en contenedores Docker.

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
