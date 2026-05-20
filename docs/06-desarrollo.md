# 06. Desarrollo de la aplicación: Decisiones Técnicas y Justificación

## 6.1 Secuencia de desarrollo y organización
El proyecto se ha ejecutado bajo una metodología de desarrollo **Scrum-Ban**, utilizando el tablero de proyectos de GitHub para gestionar el ciclo de vida de las tareas. La estructura del repositorio refleja una separación clara entre el backend (API REST) y el frontend (PWA), facilitando el despliegue independiente en Railway y Vercel respectivamente.

### Evidencias de control de versiones 
![Historial 1](.\img\Historial_commits_1.png)  
![Historial 2](.\img\Historial_commits_2.png)

### Explicación de dificultades en el parón de abril.
Durante el mes de abril, el desarrollo sufrió una pausa justificada por motivos personales y laborales, lo cual obligó a reajustar el cronograma del tercer sprint para priorizar la estabilidad del backend antes de completar la integración final del frontend en el sprint de mayo. Aún con esto se consiguió recuperar todo el trabajo perdido en esas semanas.

### Planificación y metodología
![Mockup Movimiento](.\img\Tablero_scrumban.png)  
![Mockup Movimiento](.\img\Tablero_scrumban_2.png)

## 6.2 Decisiones técnicas clave
* **Backend (Node.js + TypeORM):** Se ha optado por un patrón MVC adaptado a API. La decisión de utilizar **TypeORM** con `synchronize: true` para la entrega DAW permite una iteración rápida y segura. La lógica de negocio está centralizada en los servicios y controladores, garantizando que reglas críticas como la **prohibición de stock negativo** se ejecuten siempre en el servidor.
* **Seguridad (RBAC):** La implementación de **JWT** junto con middlewares específicos (`checkToken`, `checkRole`) asegura que los permisos sean validados en cada petición, independientemente de la interfaz gráfica del frontend.
* **Frontend (Angular 21 + PWA):** El uso de componentes **Standalone** simplifica la arquitectura y mejora la mantenibilidad. La decisión de convertir la aplicación en una **PWA** permite instalar la herramienta en cualquier terminal móvil sin depender de las tiendas de aplicaciones, optimizando la carga mediante *Service Workers*.

## 6.3 Dificultades reales y resolución técnica
Durante el desarrollo surgieron retos que pusieron a prueba la resiliencia del sistema:

1. **Gestión de variables de entorno en producción:**
   El despliegue en Railway requería un entorno dinámico. Resolví la inconsistencia entre el entorno de desarrollo local (Docker) y el de producción mediante un `DataSource` unificado que prioriza la variable `DATABASE_URL` inyectada por la plataforma, utilizando las variables `DB_*` solo como *fallback* local.
   
2. **Conflicto de módulos ESM/CommonJS:**
   La compilación de Angular 21 presentó errores al integrar librerías de generación de PDF y QR debido a la estrictez de los módulos ES. La resolución pasó por ajustar el `angular.json` mediante `allowedCommonJsDependencies`, permitiendo una compilación estable sin sacrificar el uso de herramientas de terceros esenciales para el taller.

3. **Inyección de dependencias y seguridad:**
   La implementación del interceptor de autenticación fue clave. Al automatizar la inyección del `Bearer Token` en cada petición, eliminé el riesgo de olvido de cabeceras en el cliente, centralizando el manejo de errores `401` para redirigir automáticamente al usuario al login en caso de expiración.

## 6.4 Fragmentos de código representativos

### Protección de Stock (Lógica de negocio en Controller)
La integridad de los datos es la prioridad número uno del sistema.
```ts
if (status === 'USED' && part.stock < quantity) {
  return res.status(400).json({ message: 'Stock insuficiente' });
}
```

### Orquestación de despliegue y producción (Data Source)
Uso de lógica condicional para asegurar la persistencia en cualquier entorno.
```ts
export const AppDataSource = new DataSource(
    process.env.DATABASE_URL
        ? { /* Config producción Railway */ }
        : { /* Config local Docker */ }
);
```

### Seguridad: Inyección automática de token (Interceptor)
```ts
const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
return next(authReq).pipe(catchError(err => { ... }));
```