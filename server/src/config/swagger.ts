import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management System API',
      version: '1.0.0',
      description: 'RESTful API for the Inventory Management System',
      contact: {
        name: 'API Support',
        email: 'support@inventory.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://inventory-system-geid.onrender.com/api'
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
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
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            quantity: { type: 'integer' },
            category: { type: 'string' },
            image_url: { type: 'string' },
            created_by: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            name: { type: 'string', minLength: 2 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
