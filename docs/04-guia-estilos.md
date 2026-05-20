# 04. Guía de estilos y prototipado

## 4.1 Prototipo conceptual
La arquitectura visual y la disposición de las pantallas táctiles se diseñaron previamente sobre la herramienta Figma, estableciendo flujos interactivos orientados estrictamente a la experiencia móvil (Mobile First).

* **Enlace al prototipo oficial:** [Prototipo Trazapiezas en Figma](https://www.figma.com/design/dk9zpRkvNt9ZyKRQav15tX/Sin-t%C3%ADtulo?node-id=0-1&t=a0GkbsWrmjS6NBWo-1)

## 4.2 Paleta de colores "Industrial Core"
La interfaz utiliza Tailwind CSS con una configuración personalizada en `tailwind.config.js` para asegurar coherencia en toda la PWA. El contraste es severo para garantizar la visibilidad en el entorno hostil del taller:

* **Backgrounds:** `bg-zinc-950` como color envolvente y `#1a1a1a` para tarjetas contenedoras. Un entorno oscuro que camufla las huellas y brillos en el cristal del smartphone.
* **Industrial Blue (`#045dd1`):** Color de marca y acción principal. Usado en botones primarios, enlaces activos y botones de acción flotante (FAB).
* **Safety Orange (`#d97707`):** Color de advertencia. Usado para registrar salidas de material, borrados lógicos y alertas de desabastecimiento.
* **Taller Green (`#28a745`):** Representa estados conformes, ingresos de stock albaronados y validaciones exitosas de matrículas.

## 4.3 Tipografía
Se ha delegado el peso visual a tipografías sin serifa (sans-serif) nativas del sistema, pero abusando intencionadamente del recurso tipográfico en las tarjetas de recambios y títulos: `font-black`, `uppercase` e `italic`. Esto dota a la aplicación de un diseño robusto, contundente y marcadamente mecánico, alejándose de los diseños corporativos clásicos.

## 4.4 Componentes reutilizables y Patrones de Interacción
En el framework de Angular se ha encapsulado el diseño en componentes estructurales reaprovechables:

* **`app-toast`:** Servicio y componente inyectable que dibuja alertas flotantes animadas con Tailwind para notificar éxitos o errores de la API sin interrumpir el flujo de trabajo del mecánico.
* **`app-confirmation-modal`:** Cuadro de diálogo interceptor que congela la pantalla antes de ejecutar acciones críticas o destructivas, exigiendo una doble pulsación consciente (ej. borrar una estantería).
* **Navegación Inferior (Bottom Navigation):** Menú fijo (`fixed bottom-0`) con cinco accesos clave que permite utilizar la aplicación a una sola mano.
* **Tarjetas de Inventario (Cards):** Estructuras con bordes definidos en `zinc-800` que encapsulan la referencia de la pieza y agrupan los botones de acción según el rol del usuario autenticado.

## 4.5 Mockups de las pantallas principales

Para ilustrar la aplicación del diseño "Industrial Core" y la disposición *Mobile First*, a continuación se presentan los mockups de las vistas más críticas del flujo de trabajo:

**(Nota: El diseño completo e interactivo se encuentra en el enlace de Figma proporcionado en el apartado 4.1)**

### 1. Pantalla de Acceso (Login)
Diseño minimalista para centrar la atención en la entrada de credenciales, destacando el logotipo corporativo y los campos de texto expandidos para facilitar la pulsación táctil.  
![Mockup Login](.\img\mockup-login.png)

### 2. Dashboard Principal
Centro de control con métricas rápidas y el buscador principal de matrículas en la parte superior, permitiendo un acceso directo a la trazabilidad.  
![Mockup Dashboard](.\img\mockup_dashboard.png)

### 3. Almacén e Inventario
Vista del catálogo estructurada en tarjetas individuales. Se prioriza visualmente la Referencia de la pieza y el botón de acción principal ("Instalar en coche").  
![Mockup Inventario](.\img\mockup_almacen.png)

### 4. Estanterías y detalles
Vista de las estanterías creadas y el catálogo contenido en ellas.  
![Mockup Estanterías](.\img\mockup_estanteria.png)

### 5. Registro de Movimiento (Instalación)
Formulario emergente / modal donde el mecánico introduce la matrícula destino y la cantidad a extraer, diseñado para completarse en menos de tres pulsaciones.  
![Mockup Movimiento](.\img\mockup_movimientos.png)

### 6. Perfil y gestión de usuarios
Vista de información detallada del usuario y vista de la gestión de estos logueado como user ADMIN.
![Mockup perfil](.\img\mockup_perfil.png)