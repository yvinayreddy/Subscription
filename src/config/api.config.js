const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');

// basic rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Subscription API',
    version: '1.0.0',
    description: 'API documentation for the Subscription backend'
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          status: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Validation failed' },
          code: { type: 'string', example: 'VALIDATION_ERROR' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f0c7c2aeb1d30f9fd1a001' },
          name: { type: 'string', example: 'Alice' },
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'USER' }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          password: { type: 'string', format: 'password', example: 'secret123' }
        }
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Alice' },
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          password: { type: 'string', format: 'password', example: 'secret123' }
        }
      },
      Plan: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f0c7c2aeb1d30f9fd1b001' },
          name: { type: 'string', example: 'Pro Monthly' },
          price: { type: 'number', example: 499 },
          duration: { type: 'number', example: 30 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreatePlanInput: {
        type: 'object',
        required: ['name', 'price', 'duration'],
        properties: {
          name: { type: 'string', example: 'Pro Monthly' },
          price: { type: 'number', example: 499 },
          duration: { type: 'number', example: 30 }
        }
      },
      UpdatePlanInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Pro Monthly' },
          price: { type: 'number', example: 499 },
          duration: { type: 'number', example: 30 },
          isActive: { type: 'boolean', example: true }
        }
      },
      SubscriptionUser: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f0c7c2aeb1d30f9fd1a001' },
          name: { type: 'string', example: 'Alice' },
          email: { type: 'string', format: 'email', example: 'alice@example.com' }
        }
      },
      SubscriptionPlan: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f0c7c2aeb1d30f9fd1b001' },
          name: { type: 'string', example: 'Pro Monthly' },
          price: { type: 'number', example: 499 },
          duration: { type: 'number', example: 30 }
        }
      },
      Subscription: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f0c7c2aeb1d30f9fd1c001' },
          user: {
            oneOf: [
              { type: 'string', example: '65f0c7c2aeb1d30f9fd1a001' },
              { $ref: '#/components/schemas/SubscriptionUser' }
            ]
          },
          plan: {
            oneOf: [
              { type: 'string', example: '65f0c7c2aeb1d30f9fd1b001' },
              { $ref: '#/components/schemas/SubscriptionPlan' }
            ]
          },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['active', 'cancelled', 'expired'], example: 'active' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateSubscriptionInput: {
        type: 'object',
        required: ['planId'],
        properties: {
          planId: { type: 'string', example: '65f0c7c2aeb1d30f9fd1b001' }
        }
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          image: { type: 'string' },
          caption: { type: 'string' },
          user: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.get('/api/docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger, limiter };
