import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trazapiezas API',
      version: '1.0.0',
      description: 'Documentación interactiva para la gestión de stock de Trazapiezas',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor Local (Desarrollo)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes.ts', './src/controllers/*.ts'], // Swagger leerá los comentarios aquí
};

export const swaggerSpec = swaggerJSDoc(options);