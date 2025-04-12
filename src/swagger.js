const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Room API',
      version: '1.0.0',
      description: 'A simple Express CRUD API with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // files with documentation
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
