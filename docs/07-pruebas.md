# 07. Pruebas y Aseguramiento de la Calidad (QA)

## 7.1 Metodología de pruebas
Dada la naturaleza del proyecto, centrado en la integridad de datos y la trazabilidad, se ha adoptado una metodología de **Pruebas Funcionales Integrales y Verificación de API**. Dado que el valor del proyecto reside en la consistencia de los movimientos de stock, he priorizado asegurar que las reglas de negocio (como la prohibición de stock negativo) sean inviolables.

Aunque no se ha implementado una suite de testing automatizado (TDD/BDD) en esta fase del MVP, toda la lógica de servidor ha sido validada mediante pruebas de integración directas, asegurando que el estado del sistema en PostgreSQL refleje siempre las operaciones realizadas en los controladores.

## 7.2 Plan de validación manual (Checklist)
Se ha validado la aplicación cubriendo los escenarios de uso críticos, garantizando que el sistema responde de forma controlada ante entradas inesperadas o ilegales.

### A) Seguridad y Control de Acceso
1. **Validación de Login:** Verificación de acceso con credenciales correctas y rechazo ante credenciales inválidas (401).
2. **Jerarquía de Roles (RBAC):** Comprobación de que un usuario con rol `MECHANIC` recibe un `403 Forbidden` al intentar ejecutar endpoints de administración (crear estanterías o borrar piezas).
3. **Persistencia de sesión:** Verificación de que el token JWT almacenado en `localStorage` persiste correctamente y que el interceptor inyecta la cabecera `Authorization` en todas las llamadas.

### B) Integridad del Inventario (Casos Críticos)
4. **Validación de Stock Negativo:** Prueba de estrés en `MovementController`. Se ha verificado que, ante una solicitud de salida (`USED`) de 10 unidades cuando solo existen 5 en stock, la API aborta la transacción, devuelve un `400 Bad Request` y la BBDD permanece inalterada.
5. **Reactivación de Referencias:** Verificación de que al dar de alta una pieza con una referencia ya existente (pero en estado `active: false`), el sistema la recupera en lugar de duplicarla.

### C) Trazabilidad y Documentación
6. **Integridad de Movimientos:** Verificación de que cada operación registra correctamente al usuario, la cantidad y la matrícula vinculada (en caso de `USED`).
7. **Exportación PDF:** Validación del renderizado de informes PDF, comprobando que los datos mostrados en la tabla coinciden exactamente con los registros de la base de datos para la matrícula buscada.

## 7.3 Pruebas de Integración de API (CURL)
Para asegurar que los endpoints cumplen el contrato de la API, se han ejecutado peticiones de validación mediante `curl`.

### Registro de movimiento de salida (Trazabilidad)
```bash
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer <TOKEN_VALIDO>" \
  -H "Content-Type: application/json" \
  -d '{
    "partId": 1,
    "quantity": 1,
    "status": "USED",
    "vehiclePlate": "1234ABC",
    "userId": 1
  }'
```
Resultado esperado: `201 Created` y decremento automático del stock en la entidad `Part`.
![Ejemplo de respuesta JSON](.\img\ejemplo_respuesta_JSON.png)

### Validación de errores (400)
Intento de registro con cantidad superior al stock
```
curl -X POST http://localhost:3000/api/movements ...
```
Resultado esperado: `400 Bad Request` con mensaje de error estandarizado por el `errorMiddleware`.

## 7.4 Verificación de PWA
Para validar el comportamiento del Service Worker y la PWA:

- Abrir Chrome/Edge DevTools -> pestaña Application.

- Service Workers: Verificar que ngsw-worker.js está registrado y en estado "Activated".

- Cache Storage: Verificar que los assets estáticos (index.html, JS, CSS) están almacenados en el Service Worker, permitiendo el "App Shell" operativo ante micro-cortes de red.

![Service workers](.\img\service_workers.png)