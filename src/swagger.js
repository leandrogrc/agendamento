// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
      description: "Documentação da minha API com Swagger",
    },
  },
  apis: ["./src/routes/*.js"], // Caminho dos arquivos que contêm as rotas (ajuste se necessário)
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
