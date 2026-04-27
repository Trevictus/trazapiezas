# Funcionalidades principales (MVP)

- **Gestión de catálogo (CRUD):**
  - El usuario con rol **ADMIN** puede crear, consultar, actualizar y eliminar piezas del catálogo.
  - Cada pieza incluye: referencia, marca, categoría, descripción y precio de compra.
  - El stock inicial se establece en 0 y solo puede modificarse mediante movimientos de entrada o salida.

- **Registro de movimientos inteligente:**
  - Se registran dos tipos de movimientos: **STOCK** (entrada) y **USED** (salida/uso).
  - Al registrar un movimiento de tipo **USED**, el sistema valida que no se pueda retirar más cantidad de la que hay disponible (validación de stock negativo).
  - Cada movimiento queda vinculado a la pieza y, si corresponde, a una matrícula de vehículo.

- **Trazabilidad por matrícula:**
  - Permite buscar y recuperar el historial completo de piezas utilizadas en un vehículo específico mediante su matrícula.
  - Facilita auditorías y consultas rápidas para garantías o revisiones.

- **Sincronización externa (API TallerGP):**
  - El sistema está preparado para integrarse con la API de TallerGP, permitiendo vincular piezas a órdenes de trabajo reales del taller.

# Interfaz y experiencia de usuario (UI/UX)

- **Concepto "Industrial Core":**
  - Estética basada en modo oscuro, alto contraste y colores azul, naranja y verde para resaltar acciones clave.

- **Mobile First & PWA:**
  - La aplicación es una **Progressive Web App**: no requiere instalación desde tiendas, puede funcionar offline y es instalable en dispositivos móviles.
  - El diseño prioriza la usabilidad en teléfonos y tablets.

- **Ergonomía en taller:**
  - Botones grandes y fáciles de pulsar, optimizados para uso táctil con guantes.
  - Uso de un **Floating Action Button (FAB)** para añadir piezas o movimientos rápidamente, pensado para mecánicos que operan junto al vehículo.

# Usuarios y casos de uso

- **ADMIN:** Responsable del taller o encargado de almacén. Gestiona el catálogo, audita movimientos y supervisa el stock.
- **MECÁNICO:** Personal operativo. Registra entradas de piezas y movimientos de uso en reparaciones.

**Caso de uso 1 (entrada de stock):**
- El mecánico recibe una factura de proveedor y registra la entrada de nuevas piezas en el sistema.

**Caso de uso 2 (reparación):**
- El mecánico selecciona un filtro para el coche con matrícula "1234ABC" y lo registra como "USED", quedando vinculado al historial de ese vehículo.

**Caso de uso 3 (auditoría):**
- El admin revisa por qué el stock de una pieza es bajo o consulta qué piezas se instalaron en un coche concreto para gestionar garantías.
