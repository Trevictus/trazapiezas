# 01. Introducción, objetivos y antecedentes

## Resumen

Trazapiezas es una aplicación web tipo PWA pensada para el uso diario en el taller (Cazapiezas S.L.). Su objetivo es centralizar el inventario de piezas y registrar, de forma trazable, cada entrada/salida de stock. El núcleo funcional del proyecto se apoya en:

- Catálogo de piezas con stock y ubicación (estantería).
- Registro de movimientos (entrada de stock y salida/instalación).
- Trazabilidad por matrícula (historial y exportación a PDF).
- Gestión de estanterías con generación de QR para acceder rápido a su detalle.
- Control de acceso por roles (ADMIN / MECHANIC).

## Contexto y problema

En un taller, el inventario vive en un entorno de alta rotación: piezas que entran, piezas que se montan y devoluciones. Si el control se hace con hojas de cálculo o registros manuales, aparecen varios riesgos:

- Stock desactualizado (compras duplicadas o falta de material).
- Dificultad para explicar “qué se montó en qué vehículo” ante garantías o consultas.
- Pérdida de tiempo en búsquedas (pieza/estantería).

El enfoque de Trazapiezas es reducir fricción: funcionar bien en móvil, con navegación directa y operaciones rápidas (inventario, movimientos, trazabilidad).

## Objetivos del proyecto

### Objetivos funcionales

- Gestionar un catálogo de piezas (alta, consulta, modificación y baja lógica).
- Registrar movimientos de inventario con usuario responsable, cantidad, tipo y fecha.
- Evitar salidas que provoquen stock negativo.
- Consultar movimientos por matrícula y generar un informe en PDF.
- Organizar el almacén por estanterías y facilitar el acceso con códigos QR.
- Administrar usuarios del sistema (alta, cambio de contraseña, baja/alta lógica).

### Objetivos técnicos

- Separar responsabilidades con una API REST (Node.js + Express + TypeScript) y un cliente (Angular).
- Persistir en PostgreSQL mediante TypeORM (entidades y relaciones).
- Gestionar autenticación con JWT y proteger endpoints mediante middleware.
- Documentar la API con Swagger (ruta `/api-docs`).
- Preparar despliegue del frontend (Vercel) y backend (Railway) usando variables de entorno.

### Objetivos de aprendizaje (técnicos)

- Construir un stack completo con TypeScript end-to-end.
- Integrar un servicio externo (TallerGP) con modo real (API key) y modo local (mock).
- Generar documentos (PDF) y recursos imprimibles (QR) desde el frontend.
- Trabajar con compilación estricta en Angular (strictTemplates, isolatedModules) y dependencias ESM/CJS.

## Alcance y limitaciones

### Incluido en el alcance

- Un único taller/organización (un entorno de inventario).
- Un almacén con estanterías y piezas ubicables.
- Trazabilidad por matrícula basada en los movimientos registrados.

### Fuera de alcance (por decisión de proyecto)

Para mantener el proyecto acotado, no implemento (ni documento como hecho) funcionalidades como:

- Facturación, compras a proveedores o pedidos.
- Multi-almacén/multi-sede.
- Importación masiva de catálogo.
- Gestión de órdenes de reparación completas (más allá de consultar datos de vehículo).

## Antecedentes y enfoque

El enfoque es pragmático: una interfaz mobile-first (Angular + Tailwind) con operaciones guiadas, y una API sencilla (Express + TypeORM) que centraliza reglas de negocio. La documentación y el comportamiento descritos en estos archivos se basan únicamente en lo que existe en el repositorio (código, configuración y rutas).