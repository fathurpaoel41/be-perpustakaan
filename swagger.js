const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const optionsAll = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Perpustakaan',
      version: '1.0.0',
      description: 'API untuk mengelola data perpustakaan',
    },
  },
  apis: ['./swagger/swagger.yaml'], // File yang berisi dokumentasi rute category
};

const optionsCategories = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'category API',
      version: '1.0.0',
      description: 'API untuk mengelola kategori',
    },
  },
  apis: ['./swagger/swaggerCategory.yaml'], // File yang berisi dokumentasi rute category
};

const optionsBooks = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'books API',
      version: '1.0.0',
      description: 'API untuk mengelola buku',
    },
  },
  apis: ['./swagger/swaggerBooks.yaml'], // File yang berisi dokumentasi rute books
};

const optionsLogin = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'books API',
      version: '1.0.0',
      description: 'API untuk mengelola buku',
    },
  },
  apis: ['./swagger/swaggerLogin.yaml'], // File yang berisi dokumentasi rute books
};

const swaggerSpecCategories = swaggerJSDoc(optionsCategories);
const swaggerSpecBooks = swaggerJSDoc(optionsBooks);
const swaggerLogin = swaggerJSDoc(optionsLogin);
const swaggerAll = swaggerJSDoc(optionsAll);

const swaggerDocs = (app) => {
  app.use('/api-docs/category', swaggerUi.serve, swaggerUi.setup(swaggerSpecCategories));
  app.use('/api-docs/books', swaggerUi.serve, swaggerUi.setup(swaggerSpecBooks));
  app.use('/api-docs/login', swaggerUi.serve, swaggerUi.setup(swaggerLogin));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAll));
};

module.exports = swaggerDocs;