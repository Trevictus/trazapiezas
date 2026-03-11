# Propuesta de Proyecto — Trazapiezas

## Sistema de Trazabilidad de Stock para Talleres Mecánicos (PWA)

---

> **Autor**: Víctor  
> **Fecha**: Marzo 2026  
> **Repositorio**: [Público - GitHub](https://github.com/Trevictus/trazapiezas)  

---

## Índice

1. [Identificación de necesidades (Criterio 1c)](#1-identificación-de-necesidades-criterio-1c)
2. [Oportunidades de negocio (Criterio 1d)](#2-oportunidades-de-negocio-criterio-1d)
3. [Tipo de proyecto (Criterio 1e)](#3-tipo-de-proyecto-criterio-1e)
4. [Características específicas (Criterio 1f)](#4-características-específicas-criterio-1f)
5. [Obligaciones legales y prevención (Criterio 1g)](#5-obligaciones-legales-y-prevención-criterio-1g)
6. [Ayudas y subvenciones (Criterio 1h)](#6-ayudas-y-subvenciones-criterio-1h)
7. [Guion de trabajo (Criterio 1i)](#7-guion-de-trabajo-criterio-1i)
8. [Conclusión](#8-conclusión)

---

## 1. Identificación de necesidades (Criterio 1c)

### 1.1. Descripción del problema o necesidad

La necesidad detectada surge de la imposibilidad de las PYME de 10 o más empleados del sector automovilístico, en este caso talleres mecánicos, de tener un seguimiento fiable de las piezas y artículos que se compran, se tienen en stock, se usan y se venden. Tras la observación directa del flujo de trabajo en un taller real se constató que:

- Los mecánicos entran al almacén y, si necesitan una pieza, directamente la cogen para usarla sin dejar constancia en ningún lugar. No existe un registro de salidas ni un responsable de almacén dedicado.
- La empresa empleaba un Excel compartido como único sistema de información. Este fichero se encontraba desactualizado, contenía fallos humanos acumulados y no garantizaba la integridad de los datos.
- La organización física de los productos se reducía a estanterías sin ordenación alguna, lo que dificultaba tanto el recuento como la localización de las piezas.

La ausencia de un sistema de trazabilidad demostrado conlleva una cadena de problemas operativos y estratégicos:

| Categoría | Problema |
|---|---|
| **Operativa** | Pérdida de piezas, herramientas y materiales. Falta de estándares provocando errores repetitivos. |
| **Información** | Requerir que esté la persona adecuada con la información sobre el producto en el momento. Desinformación sobre qué pieza o proveedor generó un fallo. |
| **Económica** | Devoluciones innecesarias. Aumento de costes por tiempo extra empleado en correcciones y pérdidas de materiales. |
| **Legal** | Riesgos legales, ya que la trazabilidad es obligatoria en el sector. |
| **Crecimiento** | Imposibilidad de crecer de forma ordenada. Dificultad para mejorar la eficiencia. |

### 1.2. Detección de la necesidad

La necesidad se detectó mediante observación directa del entorno laboral y entrevistas no estructuradas con el responsable de la empresa. El jefe de la empresa confirmó estas observaciones durante una charla directa, señalando que la trazabilidad es "uno de los mayores problemas a solucionar" y que, al estar en crecimiento, la situación podría llegar a ser incontrolable con la incorporación de más personal a la plantilla.

Adicionalmente, se realizó una búsqueda documental que corroboró que este tipo de problemas es generalizado en PYME del sector:

- [La falta de procedimientos documentados y medibles (LinkedIn)](https://es.linkedin.com/pulse/la-falta-de-procedimientos-documentados-y-medibles-en-enrique-8kowc)
- [5 problemas de un taller mecánico (TallerGP)](https://tallergp.com/5-problemas-taller-mecanico/)
- [Sin trazabilidad no hay control (Inthegra Software)](https://inthegrasoftware.com/sin-trazabilidad-no-hay-control/)

### 1.3. Usuarios y beneficiarios

El usuario objetivo es el autónomo empresario que dirige una PYME en crecimiento de 10 o más empleados en el sector del automovilismo. Aunque no solo se benefician los empresarios sino que los trabajadores agilizarán tareas tediosas, se reducirá el fallo humano en la introducción de datos, no se tendrá la información desperdigada ni desactualizada y los mecánicos contarán con visualización en todo momento de lo que se dispone en stock.

En concreto, se identifican dos perfiles de usuario:

- **Administrador (ADMIN)**: El jefe del taller o encargado de almacén. Gestiona el catálogo de piezas (alta, edición, eliminación) y supervisa los movimientos de stock.
- **Mecánico (MECHANIC)**: El operario que consulta el stock disponible y registra los movimientos de piezas (entrada por albarán o salida por montaje en un vehículo).

---

## 2. Oportunidades de negocio (Criterio 1d)

### 2.1. Análisis del mercado: soluciones existentes

Existen en el mercado soluciones ERP genéricas y software de gestión de taller (como Autocom, CESVI o Nexus). Sin embargo, todas comparten dos limitaciones clave que abren una oportunidad de mercado:

1. **Son soluciones de pago**, generalmente con licencias mensuales elevadas o costes de implantación que resultan inasumibles para una PYME de 10–25 empleados en fase de crecimiento.
2. **No están pensadas como "Mobile First"**. La mayoría de estos ERPs son aplicaciones de escritorio o web clásicas, diseñadas para ser operadas desde un puesto fijo de oficina. El mecánico que está en el foso o junto al elevador no va a desplazarse hasta un ordenador para registrar que ha cogido un filtro de aceite.

### 2.2. Valor diferencial de Trazapiezas

| Diferencial | Descripción |
|---|---|
| **Mobile First (PWA)** | Aplicación instalable en cualquier dispositivo sin pasar por tiendas de apps. El mecánico registra la pieza desde su propio teléfono en el momento en que la extrae del almacén. |
| **Coste cero de infraestructura inicial** | PostgreSQL, Docker, Node.js y Angular son tecnologías de código abierto. El despliegue puede realizarse en servicios freemium. |
| **Integración futura de OCR y códigos de barras** | La hoja de ruta contempla la incorporación de reconocimiento óptico de caracteres y lectura de códigos de barras mediante la cámara del dispositivo, lo que permitirá dar de alta piezas escaneando directamente el albarán del proveedor o la etiqueta del producto. Este módulo eliminará la introducción manual de datos y sus errores asociados. |
| **Enfoque vertical** | A diferencia de los ERPs horizontales, Trazapiezas se diseña específicamente para el flujo de un taller: pieza → albarán → stock → montaje en vehículo (matrícula) → histórico. |
| **Integración con Ecosistemas Existentes API TallerGP** | Trazapiezas está diseñada para conectarse con el software de gestión líder del sector TallerGP. Esto permite importar órdenes de reparación abiertas y vincular el stock de piezas directamente a los expedientes de la API comercial, eliminando la duplicidad de datos y el trabajo administrativo.

### 2.3. Potencial y escalabilidad

A medio plazo, Trazapiezas puede evolucionar hacia un modelo SaaS (Software as a Service) con un plan freemium limitado en número de piezas/movimientos y planes de pago escalables por taller o por número de empleados, manteniendo siempre unos costes muy por debajo de las soluciones ERP existentes.

El mercado potencial abarca la totalidad de PYME del sector automovilístico en España que carezcan de un sistema de trazabilidad digital, un segmento amplio donde predominan soluciones manuales o basadas en hojas de cálculo. La arquitectura técnica elegida (contenedores Docker, base de datos relacional, API REST) permite escalar horizontalmente sin necesidad de rediseñar la aplicación.

---

## 3. Tipo de proyecto (Criterio 1e)

### 3.1. Definición del tipo de aplicación

Se ha optado por desarrollar una Progressive Web App (PWA) con Angular en el frontend y Node.js en el backend. Las razones de esto son:

- **Instalable sin stores**: El mecánico puede instalar la app desde el navegador directamente, sin depender de Google Play o App Store ni de sus procesos de revisión.
- **Multiplataforma**: Un único desarrollo sirve para Android, iOS, tablets y escritorio.
- **Capacidad offline** (fase futura): Los Service Workers permitirán registrar movimientos sin conexión y sincronizarlos al recuperar la red, escenario habitual en talleres donde la cobertura puede ser irregular.
- **Actualizaciones transparentes**: Al ser una web, cada vez que el usuario accede ya dispone de la última versión sin necesidad de actualizar manualmente.

### 3.2. Justificación de la elección

Una PWA es el tipo de proyecto más adecuado para resolver la necesidad identificada porque el problema central ocurre en el almacén, no en un despacho con un ordenador. El mecánico necesita registrar la pieza en el momento exacto en que la coge, desde su propio teléfono móvil, sin instalar nada desde una tienda de aplicaciones. Una app nativa requeriría doble desarrollo y procesos de publicación en stores; una web tradicional no ofrecería la experiencia de aplicación instalada ni la posibilidad futura de funcionamiento offline. La PWA combina lo mejor de ambos.

### 3.3. Arquitectura propuesta

El sistema sigue una arquitectura **cliente-servidor REST** con separación estricta de responsabilidades:

```
┌──────────────────────────────┐
│        FRONTEND (PWA)        │
│   Angular + Angular Material │
│   TypeScript · Service Worker│
└──────────────┬───────────────┘
               │ HTTP / REST (JSON)
               │ Authorization: Bearer <JWT>
┌──────────────▼───────────────┐
│         BACKEND (API)        │
│  Node.js · Express 5 · TS   │
│  TypeORM · bcrypt · JWT      │
└──────────────┬───────────────┘
               │ TCP :5432
┌──────────────▼───────────────┐
│       BASE DE DATOS          │
│  PostgreSQL 15 (Docker)      │
│  Volumen persistente         │
└──────────────────────────────┘
```

- **Cliente Angular PWA**: Se encarga de la presentación y la experiencia de usuario. Se comunica con el backend a través de peticiones HTTP autenticadas con token JWT en la cabecera `Authorization: Bearer <token>`.
- **Servidor Express API**: Expone los endpoints REST, aplica la lógica de negocio como validación de stock, cálculos, permisos por rol, y persiste los datos en la base de datos.
- **Base de datos PostgreSQL**: Almacena las entidades `parts`, `movements` y `users`. Se ejecuta en un contenedor Docker definido en `docker-compose.yml`, garantizando portabilidad, reproducibilidad del entorno y persistencia mediante volúmenes.

El archivo `docker-compose.yml` del proyecto ya levanta un contenedor PostgreSQL 15 con un volumen persistente `postgres_data`. Esto da reproducibilidad cualquiera puede clonar el repositorio y ejecutar `docker-compose up`, aislamiento de la base de datos que corre separada del sistema operativo del host y escalabilidad futura.

---

## 4. Características específicas (Criterio 1f)

### 4.1. Funcionalidades principales (MVP)

A continuación se detallan las funcionalidades que conforman el Producto Mínimo Viable. Se indica su estado actual basado en el código ya existente en la carpeta `/backend`.

#### 4.1.1. CRUD completo de piezas

El controlador `PartController` implementa las cuatro operaciones básicas sobre la entidad `Part`:

| Operación | Endpoint | Método | Rol requerido | Estado |
|---|---|---|---|---|
| Crear pieza | `/api/parts` | `POST` | ADMIN | Implementado |
| Listar piezas | `/api/parts` | `GET` | Cualquier autenticado | Implementado |
| Editar pieza | `/api/parts/:id` | `PUT` | ADMIN | Implementado |
| Eliminar pieza | `/api/parts/:id` | `DELETE` | ADMIN | Implementado |

Cada pieza se modela con los campos: `reference` (única), `brand`, `category`, `description`, `purchasePrice` y `stock`.

#### 4.1.2. Registro de movimientos con validación de stock negativo

El controlador `MovementController` gestiona la entrada y salida de piezas:

- **Movimiento de tipo STOCK**: Suma la cantidad al stock de la pieza.
- **Movimiento de tipo USED**: Resta la cantidad al stock de la pieza por montaje en un vehículo.
- **Validación de stock negativo**: Antes de registrar un movimiento `USED`, el sistema comprueba que exista stock suficiente. Si `part.stock < quantity`, devuelve un error `400` con el mensaje `"Stock insuficiente. Solo quedan X unidades."`. Este mecanismo actúa como para mantener la coherencia de los datos.
- Cada movimiento registra además el `purchasePrice`, precio neto real del albarán y la `vehiclePlate`, matrícula del vehículo destino, lo que permite la trazabilidad completa: saber qué pieza, a qué precio se compró y en qué coche se montó.
- Estados soportados: `PENDING`, `STOCK`, `USED`, `RETURNED`.

| Operación | Endpoint | Método | Estado |
|---|---|---|---|
| Crear movimiento | `/api/movements` | `POST` | Implementado |
| Buscar por matrícula | `/api/movements/vehicle/:plate` | `GET` | Implementado |

#### 4.1.3. Buscador por matrícula

El endpoint `GET /api/movements/vehicle/:plate` permite buscar todos los movimientos asociados a una matrícula concreta, devolviendo la información de las piezas relacionadas gracias a la relación `ManyToOne` entre `Movement` y `Part`. Este buscador es fundamental para responder a preguntas cómo qué piezas se le han montado al coche con matrícula 1234-ABC.

#### 4.1.4. Seguridad por roles con JWT

El sistema de autenticación y autorización está plenamente operativo:

- **Registro** `POST /api/auth/register`: Crea un usuario con rol `ADMIN` o `MECHANIC`. La contraseña se encripta automáticamente mediante el decorador `@BeforeInsert` y la librería bcrypt.
- **Login** `POST /api/auth/login`: Valida credenciales con `bcrypt.compare` y genera un JWT con una validez de 24 horas, incluyendo el `userId` y el `role`.
- **Middleware `checkToken`**: Intercepta cada petición protegida, extrae el token de la cabecera `Authorization`, lo verifica con `jwt.verify` y almacena los datos decodificados del usuario en el objeto `request` para su uso posterior.
- **Middleware `checkRole`**: Valida que el rol del usuario autenticado esté entre los roles permitidos para el endpoint. Por ejemplo, las operaciones de creación, edición y eliminación de piezas están restringidas al rol `ADMIN`.

#### 4.1.5. Generación de Órdenes de Reparación y Pre-facturación

El sistema aprovecha la relación entre las entidades Movement y Part para automatizar la documentación administrativa del taller:

- **Orden de Reparación Digital**: Al buscar una matrícula, el sistema genera un listado de materiales empleados. Esto permite al mecánico entregar un parte de trabajo digital sin errores de transcripción.
- **Cálculo de Costes para Facturación**: Dado que cada movimiento `USED` registra el `purchasePrice` decimal en el momento de la salida , el administrador puede exportar un desglose de costes real para la factura final del cliente.
- **Trazabilidad de Garantía**: En caso de fallo de una pieza, el sistema permite emitir un informe que vincula la referencia del proveedor con el vehículo específico y la fecha de montaje.

#### 4.1.6. Integración con TallerGP External API

El sistema actuará como un cliente de la API de TallerGP, permitiendo la sincronización de datos de vehículos y órdenes de reparación. Esto garantiza que la información de las piezas usadas en Trazapiezas esté vinculada legal y administrativamente con los expedientes comerciales del taller. 

### 4.2. Priorización de funcionalidades

| Prioridad | Funcionalidad | Justificación |
|---|---|---|
| **Obligatoria** | CRUD de piezas | Sin catálogo de piezas no hay nada que trazar. |
| **Obligatoria** | Registro de movimientos `STOCK/USED` | Es el núcleo de la trazabilidad: entrada y salida de piezas. |
| **Obligatoria** | Validación de stock negativo | Evita inconsistencias críticas en los datos de inventario. |
| **Obligatoria** | Autenticación JWT y roles (ADMIN/MECHANIC) | Imprescindible para controlar quién puede modificar el catálogo y quién solo registra movimientos. |
| **Obligatoria** | Buscador por matrícula | Permite la trazabilidad completa pieza-vehículo, requisito central del proyecto. |
| **Opcional** | Interfaz PWA | Necesaria para la experiencia de usuario final, pero el backend funciona de forma independiente. |
| **Opcional** | Integración OCR / Códigos de barras | Mejora significativa de la experiencia, pero no bloquea la funcionalidad básica. |
| **Opcional** | Modo offline con Service Workers | Mejora para entornos con conectividad irregular, planificada para fases posteriores. |

### 4.3. Requisitos técnicos

#### 4.3.1. Modelo de datos relacional

- **Entidad User -> Usuarios**: Gestiona el acceso y los permisos del sistema. Almacena el username como clave única, la password hasheada con bcrypt para seguridad y un role `ADMIN` o `MECHANIC` que define qué acciones puede realizar el usuario en la interfaz.  

- **Entidad Part ->Piezas**: Representa el catálogo maestro de artículos. Cada registro incluye una reference única del código del fabricante, brand, category, description y el purchasePrice unitario. Además, mantiene un contador de stock que se actualiza automáticamente con cada movimiento.  

- **Entidad Movement -> Trazabilidad**: Es la tabla que registra el historial de entradas y salidas. Se conecta con la pieza mediante una relación ManyToOne. Captura la quantity movida, el purchasePrice real de ese albarán concreto y la vehiclePlate (matrícula) en caso de que la pieza se haya usado en un coche. El campo status (Enum: STOCK, USED, etc.) permite filtrar el flujo de la pieza.

#### 4.3.2. Tecnologías e integraciones

| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | LTS | Entorno de ejecución del servidor |
| **Express** | 5.x | Framework HTTP para la API REST |
| **TypeScript** | 5.9 | Tipado estático en todo el proyecto |
| **TypeORM** | 0.3.x | ORM para PostgreSQL con soporte de decoradores y migraciones |
| **PostgreSQL** | 15 | Base de datos relacional con soporte de enums, decimales y timestamps |
| **bcrypt** | 6.x | Hash de contraseñas con factor de coste configurable |
| **jsonwebtoken** | 9.x | Generación y verificación de tokens JWT |
| **Docker / Docker Compose** | — | Contenerización de la base de datos |
| **Angular** | 17+ | Framework del frontend PWA |
| **Angular Material** |  | Librería de componentes UI accesibles |
| **Axios** | 1.13.x | Librería para realizar peticiones HTTP seguras desde nuestro backend hacia la API de TallerGP.

---

## 5. Obligaciones legales y prevención (Criterio 1g)

### 5.1. Normativa aplicable

La aplicación maneja datos personales de usuarios y datos asociados a matrículas de vehículos, que pueden considerarse datos personales vinculables a personas físicas. La normativa de obligado cumplimiento incluye:

- **RGPD** (Reglamento UE 2016/679): Reglamento General de Protección de Datos, aplicable a todo tratamiento de datos personales.
- **LOPDGDD** (Ley Orgánica 3/2018): Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales, transposición española del RGPD.
- **LSSI-CE** (Ley 34/2002): Ley de Servicios de la Sociedad de la Información y Comercio Electrónico, aplicable al ofrecer servicios por vía electrónica.
- **Normativa de trazabilidad sectorial**: La trazabilidad de productos y piezas de automoción está sujeta a regulaciones como el Reglamento CE 1907/2006 (REACH) para sustancias químicas en componentes y la Directiva 2000/53/CE sobre gestión de residuos de vehículos.

Trazapiezas facilita el cumplimiento de estas normativas al proporcionar un registro de cada pieza: origen (proveedor y precio de compra), ubicación actual (stock o montada en vehículo con matrícula) y fecha de cada movimiento.

### 5.2. Medidas de seguridad y protección de datos

Medidas técnicas ya implementadas o planificadas:

| Medida | Implementación | Estado |
|---|---|---|
| **Encriptación de contraseñas** | `bcrypt` con factor de coste 10 mediante `@BeforeInsert`. Las contraseñas jamás se almacenan en texto plano. | Implementado |
| **Protección de endpoints** | Middleware `checkToken` que exige un JWT válido en cada petición a recursos protegidos. Sin token o con token expirado, la respuesta es `403 / 401`. | Implementado |
| **Control de acceso por rol** | Middleware `checkRole` que restringe operaciones sensibles al rol `ADMIN`. Un mecánico autenticado no puede modificar el catálogo de piezas. | Implementado |
| **Principio de minimización** | Solo se almacenan los datos estrictamente necesarios para la funcionalidad de la aplicación: username, password hasheado y rol. No se solicitan datos personales adicionales como correo, teléfono o DNI. | Implementado |
| **Tokens con caducidad** | Los JWT se generan con una expiración de 24 horas `expiresIn: "24h"`, limitando la ventana de exposición en caso de filtración. | Implementado |
| **Variables de entorno** | Las credenciales de la base de datos y la clave secreta JWT se gestionan mediante variables de entorno `dotenv`, evitando su presencia en el código fuente. | Implementado |
| **Política de privacidad** | Documento informativo accesible desde la aplicación detallando la finalidad del tratamiento. | Previsto |
| **Derecho de supresión** | Endpoint para la eliminación de cuentas de usuario, facilitando el ejercicio del derecho al olvido. | Previsto |
| **Registro de actividades de tratamiento** | Documento interno conforme al art. 30 del RGPD. | Previsto |

### 5.3. Accesibilidad web WCAG

La futura interfaz Angular se desarrollará siguiendo las pautas WCAG 2.1 nivel AA, requisito legal en España para aplicaciones del sector servicios conforme al Real Decreto 1112/2018:

- **Angular Material** proporciona componentes con soporte nativo de ARIA (Accessible Rich Internet Applications): etiquetas, roles, estados y navegación por teclado.
- Se emplearán contrastes de color conformes al ratio mínimo 4.5:1 para texto normal.
- Todos los formularios incluirán etiquetas asociadas, mensajes de error descriptivos y foco visible para la navegación por teclado.
- Se contemplarán textos alternativos en imágenes y elementos gráficos.
- Se realizarán auditorías con herramientas como **Lighthouse**, **Wave** y **TAW** para validar el cumplimiento.

---

## 6. Ayudas y subvenciones (Criterio 1h)

### 6.1. Ayudas disponibles para proyectos tecnológicos
El proyecto **Trazapiezas** se alinea con los objetivos de digitalización nacionales y europeos para el sector industrial. Las principales vías de financiación identificadas son:

- **Kit Digital (Fondos Next Generation EU)**: Programa actualizado para el periodo 2024-2026. Trazapiezas encaja en la categoría de **"Gestión de Procesos"**. Para el **Segmento I** (10-49 empleados), la ayuda disponible es de hasta **6.000 €**. Se ha verificado que para micro-PYMES del Segmento III, el bono se ha incrementado recientemente a **3.000 €**.
- **PERTE VEC (Vehículo Eléctrico y Conectado)**: Líneas de ayuda para la digitalización de la cadena de valor en el sector automoción, donde la trazabilidad y el control de componentes son requisitos de calidad obligatorios.
- **Bonificaciones a la I+D+i**: Al tratarse de un desarrollo de software propio, la empresa puede acogerse a bonificaciones en las cuotas de la Seguridad Social para el personal técnico dedicado al desarrollo.

### 6.2. Recursos de bajo coste y Open Source
Para garantizar la viabilidad económica y eliminar el pago de licencias recurrentes, se ha seleccionado un stack tecnológico basado íntegramente en software libre:

| Recurso | Tipo | Justificación técnica |
| --- | --- | --- |
| **PostgreSQL 15** | Base de Datos | Motor relacional robusto que corre en contenedor **Docker**, eliminando costes de licencia y garantizando integridad. |
| **Docker Compose** | Infraestructura | Permite el despliegue de la API y la base de datos de forma modular y gratuita en cualquier servidor. |
| **Node.js / Express 5** | Backend | Frameworks de alto rendimiento y código abierto con una curva de mantenimiento económica. |
| **Tesseract.js** | OCR | Librería gratuita para procesar albaranes directamente en el navegador, evitando el uso de APIs de pago por visión artificial. |
| **Render / Railway** | Hosting | Para el despliegue del MVP y pruebas de validación con el usuario final. |

---

## 7. Guion de trabajo (Criterio 1i)

### 7.1. Metodología de gestión: Scrumban
Dada la individualidad del proyecto, se utilizará la metodología **Scrumban**. Esta combina la estructura de Sprints quincenales de Scrum para las revisiones y demostraciones en vídeo, con la flexibilidad de un tablero **Kanban** para gestionar el flujo de tareas pendientes, en curso y finalizadas.

### 7.2. Cronograma de Sprints (25 Feb — 20 May)

Cada Sprint finaliza con una demostración funcional grabada en vídeo para validar los avances.

#### Sprint 1: Motor del Taller y Lógica Core (25 Feb — 10 Mar) — **COMPLETADO**
- **Objetivo**: Establecer la infraestructura y la inteligencia del inventario.
- **Entregables**: 
    - Contenedor **Docker** con PostgreSQL 15 operativo.
    - Estructura Node.js/TypeScript con **Bcrypt** y -*JWT**.
    - Lógica de trazabilidad completa: **Validación de stock negativo** y actualización automática de existencias.
    - Buscador por **matrícula** y control de acceso por -*Roles** (Admin/Mechanic).
- **Vídeo 1**: Demostración de flujo completo en Postman: Registro -> Login -> Entrada de stock -> Error por stock insuficiente en salida -> Búsqueda por matrícula.

#### Sprint 2: Blindaje de API e Integración (11 Mar — 24 Mar) — **EN CURSO**
- **Objetivo**: Preparar el backend para el consumo externo y asegurar la calidad del dato.
- **Entregables**: 
    - Configuración de **CORS** para permitir la comunicación segura con Angular.
    - Documentación interactiva de la API mediante **Swagger UI** (`/api-docs`).
    - Estandarización de respuestas de error (JSON consistente para la PWA).
    - Colección final de Postman organizada para pruebas de integración.
- **Vídeo 2**: Presentación de la documentación Swagger y pruebas de conectividad simulando peticiones desde distintos orígenes.

#### Sprint 3: Interfaz de Usuario y Prototipado (25 Mar — 07 Abr)
- **Objetivo**: Diseñar la experiencia del mecánico en el entorno real del taller.
- **Entregables**: Wireframes y prototipo de alta fidelidad en **Figma** (Mobile First). Diseño de flujos de registro rápido y dashboard de stock crítico.
- **Vídeo 3**: "Walkthrough" interactivo en Figma simulando el uso de la app desde un smartphone.

#### Sprint 4: Desarrollo Frontend PWA (08 Abr — 21 Abr)
- **Objetivo**: Construir la aplicación cliente que consumirá la API.
- **Entregables**: Estructura de **Angular** con Material Design. Implementación de servicios de comunicación. Pantallas funcionales de Login e Inventario real.
- **Vídeo 4**: Primera navegación real desde el móvil consultando y mostrando datos reales de la base de datos.

#### Sprint 5: Capacidades Offline y Ecosistema (22 Abr — 05 May)
- **Objetivo**: Garantizar el funcionamiento en el taller y conectar con herramientas externas.
- **Entregables**: Configuración de **Service Workers** (PWA) para cacheo y uso offline. Integración con la **API de TallerGP** para volcado de datos de vehículos.
- **Vídeo 5**: Demostración de registro de pieza sin conexión y sincronización automática al recuperar el WiFi.

#### Sprint 6: Automatización y Cierre (06 May — 20 May)
- **Objetivo**: Añadir valor añadido y finalizar la documentación técnica.
- **Entregables**: Implementación de **OCR/Escaneo** para albaranes. Módulo de generación de **PDF para órdenes de reparación**. Auditoría final de accesibilidad.
- **Vídeo 6**: Demo final "End-to-End": Escaneo de albarán -> Asignación a matrícula -> Generación de informe final.



### 7.3. Herramientas de seguimiento
- **GitHub Projects**: Tablero Kanban para visualizar el avance del Sprint.
- **Toggl Track**: Para medir el tiempo real dedicado a cada funcionalidad y ajustar el esfuerzo.
- **OBS**: Herramientas para la grabación de los vídeos de demostración de cada Sprint.

---

## 8. Conclusión

Trazapiezas nace de una necesidad real observada directamente en un taller mecánico en crecimiento: la imposibilidad de rastrear el recorrido de las piezas desde su compra hasta su montaje en un vehículo. Lo que hoy se gestiona con un Excel desactualizado y la memoria de los empleados, se convierte en un sistema digital accesible desde el bolsillo de cada mecánico.

El backend ya funcional demuestra la viabilidad técnica del proyecto: las piezas se crean, los movimientos se registran con control de stock, las búsquedas por matrícula devuelven el historial completo y todo ello protegido por un sistema de autenticación robusto con roles diferenciados.

El camino que queda por recorrer — el prototipado de la interfaz, su desarrollo en Angular como PWA y la integración de tecnologías de escaneo — se plantea de forma realista, apoyado exclusivamente en herramientas gratuitas y de código abierto, lo que hace de Trazapiezas una solución viable no solo técnica sino también económicamente para las PYME del sector.


