const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const optionsCategories = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'category API',
      version: '1.0.0',
      description: 'API untuk mengelola kategori',
    },
  },
  apis: ['./swagger/swagger.yaml'], // File yang berisi dokumentasi rute
};


const swaggerSpecCategories = swaggerJSDoc(optionsCategories);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecCategories));

};

module.exports = swaggerDocs;