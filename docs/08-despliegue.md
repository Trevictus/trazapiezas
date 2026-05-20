# 08. Despliegue, Arquitectura y CI/CD

## 8.1 Arquitectura de despliegue (Separación de servicios)
He diseñado el entorno de producción utilizando un paradigma de **despliegue fragmentado**, separando el ciclo de vida del frontend y del backend para garantizar la escalabilidad y la gestión óptima de recursos.

* **Frontend (PWA):** Desplegado en **Vercel** como una *Single Page Application* (SPA). Vercel actúa como CDN global, sirviendo el "App Shell" de Angular y habilitando el Service Worker para optimizar la carga en móviles.
* **Backend (API REST):** Desplegado en **Railway**, aprovechando su capacidad de levantar contenedores efímeros basados en el Dockerfile del proyecto.
* **Persistencia:** Utilizo una instancia de **PostgreSQL 15** gestionada dentro del ecosistema de Railway, vinculada mediante una variable de entorno unificada (`DATABASE_URL`).

## 8.2 Configuración del Cliente (Vercel)
Para evitar los errores `404 Not Found` al navegar por rutas internas de Angular (ej. `/history` o `/inventory`) desde el navegador, he configurado el archivo `vercel.json` con un **rewrite** global:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Esta configuración garantiza que cualquier petición sea redirigida a `index.html`, dejando que el Router de Angular gestione la navegación de forma interna.

![Estado Vercel](.\img\panel_vercel.png)

## 8.3 Configuración del Servidor (Railway)
La API está optimizada para la nube siguiendo estos criterios:

- **Orquestación:** El despliegue se basa en el script npm run build (transpilación a JS) y npm start (lanzamiento desde /dist).

- **Gestión de Variables:** He implementado un DataSource robusto en TypeORM que detecta el entorno:

Si detecta DATABASE_URL (Railway), se conecta mediante la cadena de conexión completa (modo producción).

Si no, utiliza las variables DB_HOST, DB_PORT, etc. (modo local con Docker).

- **Seguridad** (CORS): He blindado la API mediante el middleware cors, permitiendo únicamente peticiones desde mi dominio oficial de Vercel y localhost para entornos de desarrollo.

![Estado Railway](.\img\panel_railway.png)

## 8.4 Base de datos

- En local: PostgreSQL 15 con `docker-compose.yml`.
- En producción: PostgreSQL gestionado por Railway, consumido vía `DATABASE_URL`.

> El backend usa `synchronize: true` para autocrear/ajustar tablas al arrancar.

## 8.5 CI/CD y Control de Versiones
El proyecto sigue una estrategia de ramas en GitHub con commits descriptivos basados en el estándar Conventional Commits (ej. `feat:`, `fix:`, `refactor:`), lo cual facilita el seguimiento de cambios y la depuración de errores durante el ciclo de vida del proyecto.

El despliegue de Vercel está vinculado directamente al repositorio, garantizando que cada ``git push` a la rama principal dispare automáticamente un nuevo proceso de construcción (build) y despliegue del frontend, asegurando que la versión en producción esté siempre sincronizada con la última versión probada.