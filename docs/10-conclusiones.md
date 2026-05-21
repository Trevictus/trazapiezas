# 10. Conclusiones y trabajo futuro

## 10.1 Evaluación crítica respecto a los objetivos iniciales

Al realizar un análisis retrospectivo y crítico de **Trazapiezas**, evalúo cómo las metas del anteproyecto se han enfrentado a la realidad técnica y a la dinámica de un entorno de producción real. 

### Aciertos de arquitectura y operativos
* **Desacoplamiento front-back:** La decisión de fragmentar la arquitectura (Angular en Vercel y Express en Railway) permite que el ciclo de vida, la compilación y el despliegue de la PWA sean independientes de la API REST y garantiza que los ajustes en la interfaz no bloquearan la disponibilidad del servidor de datos.
* **Inmutabilidad de la trazabilidad:** Inicialmente, se planteó un control de inventario basado en la mutación de campos numéricos de stock. Evaluando el flujo de un taller mecánico, reorienté el diseño hacia un modelo inmutable donde cada alteración es un registro en la entidad `Movement`, vinculando de forma obligatoria operario, fecha, cantidad y metadatos de automoción (Matrícula, VIN, Código de Motor). Esto transformó una base de datos de almacén común en un sistema de revisión forense de reparaciones.
* **Persistencia condicional:** Diseñar el `DataSource` de TypeORM para discriminar entornos en tiempo de ejecución eliminó la fragilidad en los despliegues. Esto facilitó directamente la dockerización posterior del entorno de desarrollo sin peligro de colisión con la base de datos de producción.

### Gestión de riesgos y contingencias temporales
El mayor riesgo del proyecto residió en la gestión del tiempo. El desarrollo sufrió una pausa crítica y prolongada durante el mes de abril debido a motivos estrictamente personales y laborales. Ante la amenaza real de no terminar el MVP, apliqué la estratégia de:
1. **Reducción del alcance estético:** Se disminuyó el desarrollo de la interfaz gráfica en Angular.
2. **Priorización de reglas de negocio:** Me centré en blindar la integridad transaccional del backend, como la interceptación de stock negativo en `MovementController` y asegurar el ciclo de vida de persistencia en PostgreSQL.
3. **Resiliencia ante terceros:** Para mitigar la dependencia con la plataforma externa TallerGP, diseñé en el `ExternalApiService` un patrón de comportamiento dual. Si la `TALLERGP_API_KEY` no se detecta en el entorno, el sistema conmuta automáticamente a un `mock local`, garantizando la total operatividad del software de cara a evaluaciones.

---

## 10.2 Grado de cumplimiento del alcance propuesto

El proyecto ha alcanzado un grado de cumplimiento global del **95% - 100%** respecto al catálogo de requisitos iniciales. Todas las historias de usuario catalogadas como críticas u obligatorias han sido programadas, desplegadas y verificadas en entornos de producción.

A continuación, se representa la matriz técnica de cumplimiento con el estado final de las funcionalidades del sistema:

| Funcionalidad Original | Prioridad | Estado Técnico Final | Evidencia en Repositorio / Código |
| :--- | :--- | :--- | :--- |
| **CRUD catálogo de piezas** | Obligatoria | **100% Ejecutado** | Entidad `Part` en TypeORM. Implementa borrado lógico mediante flag `active: false` para preservar la integridad referencial de los movimientos históricos de vehículos. |
| **Registro transaccional (`STOCK/USED`)** | Obligatoria | **100% Ejecutado** | Flujo controlado en `MovementController`. Centraliza la lógica de auditoría reduciendo la mutación directa en la tabla de inventario. |
| **Validación de stock negativo** | Obligatoria | **100% Ejecutado** | Interceptación en backend `part.stock < quantity`. Si se infringe la restricción, se aborta la transacción mediante el `errorMiddleware` devolviendo un código HTTP 400. |
| **Autenticación y RBAC** | Obligatoria | **100% Ejecutado** | Middlewares `checkToken` y `checkRole` en Express. Interceptor HTTP en Angular para inyección del Bearer Token y Guards para protección de rutas de administración. |
| **Buscador de trazabilidad** | Obligatoria | **100% Ejecutado** | Endpoint `/api/movements/vehicle/:plate`. Renderiza el histórico ordenado cronológicamente de forma descendente y se integra con el módulo de exportación PDF. |
| **Aplicación móvil PWA** | Opcional | **100% Ejecutado** | Configuración nativa de Service Worker `ngsw-config.json` y manifiesto web. Instalable de forma nativa en sistemas Android e iOS. |
| **Arquitectura multi-contenedor** | Opcional | **100% Ejecutado** | Orquestación mediante `docker-compose.yml` en la raíz. Aísla los servicios en la red puenteada `trazapiezas-network` con mapeo de puertos limpios. |
| **Automatización de almacén** | Opcional | **Reorientado con Éxito** | Se sustituyó la lectura OCR inicial por un motor de **Generación de QR Dinámicos** para estanterías `/inventory/shelf/:id`, imprimiendo etiquetas físicas directas desde el cliente. |

---

## 10.3 Plan de mejoras y líneas de trabajo futuras

Para dotar a `Trazapiezas` de una proyección comercial y tecnológica de nivel empresarial, se han definido las siguientes líneas de desarrollo futuro distribuidas por áreas de especialización:

### 1. Integración hardware e inteligencia artificial en módulo de almacén
* **Implementación de reconocimiento OCR de alta densidad:** Integración de la API de `Google Cloud Vision` o `Tesseract.js` directamente en el flujo de la PWA de Angular. El objetivo es permitir que el mecánico capture la ficha técnica del vehículo o la etiqueta del fabricante de la pieza con la cámara del móvil, extrayendo de forma automatizada la matrícula, el VIN o la referencia del recambio.

### 2. Conectividad ecosistémica B2B, integración de APIs de terceros
* **Pasarela de interconexión con G-SMART:** Desarrollo de un microservicio intermedio de sincronización bidireccional con la plataforma de gestión de talleres **G-SMART**. Esto permitirá que cada vez que se registre un movimiento de tipo `USED` (instalado) en Trazapiezas, la orden de trabajo se actualice, facture y catalogue automáticamente en el sistema central de facturación de G-SMART, eliminando la duplicidad administrativa.

### 3. Optimización visual del catálogo
* **Generación y almacenamiento automatizado de imágenes:** Integración de un servicio de almacenamiento en la nube `Cloudinary` o `AWS S3` conectado a la entidad `Part`. Al dar de alta una pieza, el administrador podrá fotografiar el recambio físico o bien el sistema consultará APIs de proveedores para descargar e inyectar de forma dinámica la imagen descriptiva de la pieza, mejorando la de identificación visual por parte de los operarios en el inventario.

### 4. Robustez funcional avanzada
* **Módulo de gestión de proveedores y alertas de stock mínimo:** Implementación de un sistema de alertas en tiempo real y envío automatizado de correos electrónicos cuando el stock de una pieza crítica caiga por debajo de un umbral mínimo, generando pedidos automáticos de compra en formato PDF.
* **Módulo de gestión de ubicaciones geolocalizadas dentro del taller:** Evolución del sistema de estanterías actual para permitir un mapeo interactivo en 2D del taller, facilitando al mecánico la navegación visual en una tableta para encontrar el pasillo y altura exactos donde está la pieza.

---

## 10.4 Lecciones aprendidas

Dentro de las lecciones que me llevo a cuestas, las más destacadas son:

### 1. TypeScript y la compilación
- En el `tsconfig.json`, activé el `strict: true`, haciendo que en la compilación no se me pasase ni una inconsistencia. Por lo tanto en TypeScript estricto no se ejecuta el tipico fallo en el navegador, sino que obliga a que ese error salte en el editor antes de compilar.

- En Angular con `strictTemplates: true` si declaras una variable cómo número y en el HTML le pasas esta a un input que espera un texto se frena la build.

- Las librerías viejas al importarlas a un entorno esctricto, TypeScript se queja porque no encuentra los archivos de definición de tipos.

- Usar `any` es peligroso debido a que si quieres acabar rápido, si cambias el nombre de una propiedad en el backend, el frontend te avisará de que se ha roto demasiado tarde cuando la pantalla se quede en blanco.

Esto me obligó a refactorizar interfaces e investigar `CommonsJS`, pero hizo que si el proyecto compila, el tipado en producción es cien por cien seguro.

### 2. El control de la base de datos y la persistencia

- La impulsividad en caliente de tener que borrar el contenedor y los volúmenes cada vez que se presentaba un fallo grave en la base de datos. Eso en una empresa grande cuesta el despido.

- TypeORM traduce tu código TypeScript a sentencias SQL, pero cuando cambias un estado a isActive: false por error, el backend no te deja loguearte para cambiarlo desde la interfaz. Mediante el acceso a la consola interactiva de `plsql` en PostgreSQL, se puede hablar directamente con los datos.

- Bcrypt genera un hash con las contraseñas y no puedes adivinar que texto contiene este, pero lo que si puedes hacer es mediante un hash ya conocido sobrescribir el anterior para obtener acceso.

Mi mayor miedo era modificar la base de datos en producción mediante sentencias SQL directas en la consola, pero lo perdí aprendiendo que el backend y la base de datos son mi único búnker.

### 3. Presión en las metodologías ágiles

- Normalmente los planes de a futuro suelen fracasar. Los inconvenientes personales y laborales surgen, y esto me ha enseñado la manera en la que reacciono cuando el tiempo se me echa encima.

- El MVP es ahora para mí, no un producto mal programado o a medio hacer, sino un producto que tiene pocas funcionalidades, pero que son totalmente sólidas, estables y aportan valor de megocio. En *Trazapiezas* que no tenga degradado un botón o animaciones no implican que la aplicación no pueda seguir funcionando, pero si falla la validación de stock negativo, el negocio se rompe.

- Scrum también signica adaptabilidad. Congelé el alcance estético en pos de la limpieza de backlog, moví tareas secundarias a futuro y aseguré que la persistencia fuera top.

El parón de abril hizo que me diese cuenta que en este mundo también existen los inconvenientes. Usando metodologías ágiles pude administrar el tiempo, y sacrificar aspectos estéticos asegurando un MVP robusto en la lógica de negocio.

### 4. Seguridad y estados de red

- En local todo era bonito y funcionaba cómo la seda, hasta que lo subí a la nube y todo parecía desmoronarse. CORS, un mecanismo que usan los navegadores para prohibir que un script haga llamadas a una API de diferente si corren en diferentes dominios. Es por eso que tuve que configurar el middleware de CORS en Express para que el backend enviara cabeceras aceptadas  y el navegador no las bloquease.

- Las variables de entorno nunca se suben a GitHub, ya que pueden robar tu clave. El JWT_SCRET del .env.example es un placeholder con una cadena simulada de desarrollo

---

## 10.5 Reflexión final

Desarrollar *Trazapiezas* ha supuesto un punto de inflexión en mi trayectoria como desarrollador. Al iniciar este proyecto, la visión académica tendía a fragmentar el software en asignaturas aisladas. La mayor revelación de este proceso ha sido comprender que el software real no vive en compartimentos estancos, sino que es un organismo donde cada engranaje debe coexistir en perfecta armonía.

*Trazapiezas* no es solo el resultado de haber consolidado los Resultados de Aprendizaje del ciclo, también es la evidencia de mi transición de estudiante que une piezas de código a desarrollador capaz de diseñar, contenerizar, blindar y desplegar soluciones tecnológicas preparadas para el mundo real.