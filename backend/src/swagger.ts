import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trazapiezas API',
      version: '1.0.0',
      description: 'Documentación técnica del sistema de trazabilidad de stock',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor Local',
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
    paths: {
      '/auth/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Login correcto' } }
        }
      },
      '/auth/register': {
        post: {
          tags: ['Autenticación'],
          summary: 'Registrar un nuevo usuario',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', example: 'mechanic_vitor' },
                    password: { type: 'string', example: '123456' },
                    role: { 
                      type: 'string', 
                      enum: ['ADMIN', 'MECHANIC'],
                      example: 'MECHANIC' 
                    }
                  },
                  required: ['username', 'password', 'role']
                }
              }
            }
          },
          responses: {
            201: { description: 'Usuario creado correctamente' },
            500: { description: 'Error al registrar usuario' }
          }
        }
      },
      '/parts': {
        get: {
          tags: ['Piezas'],
          summary: 'Listar catálogo',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de piezas' } }
        },
        post: {
          tags: ['Piezas'],
          summary: 'Crear pieza (ADMIN)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    reference: { type: 'string' },
                    brand: { type: 'string' },
                    category: { type: 'string' },
                    description: { type: 'string' },
                    purchasePrice: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Pieza creada' } }
        }
      },
      '/parts/{id}': {
        put: {
          tags: ['Piezas'],
          summary: 'Actualizar pieza',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Actualizado' } }
        },
        delete: {
          tags: ['Piezas'],
          summary: 'Eliminar pieza',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Eliminado' } }
        }
      },
      '/movements': {
        post: {
          tags: ['Movimientos'],
          summary: 'Registrar STOCK o USED',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    partId: { type: 'integer' },
                    quantity: { type: 'integer' },
                    status: { type: 'string' },
                    vehiclePlate: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Movimiento registrado' } }
        }
      },
      '/movements/vehicle/{plate}': {
        get: {
          tags: ['Movimientos'],
          summary: 'Historial por matrícula',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'plate', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Lista de movimientos' } }
        }
      }
    }
  },
  apis: [], // IMPORTANTE: Dejar vacío para no leer comentarios del código
};

export const swaggerSpec = swaggerJSDoc(options);