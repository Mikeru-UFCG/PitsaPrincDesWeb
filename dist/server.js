"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc")); // Import Swagger JSDoc
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express")); // Import Swagger UI
const cors_1 = __importDefault(require("cors")); // Import CORS
const app_1 = __importDefault(require("../src/app")); // Importa o app

const port = 3000;

// Configurações do Swagger
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "PDW Pizzas API",
        version: "1.0.0",
        description: "API para gerenciamento de pedidos de pizza, clientes, entregadores e estabelecimentos.",
    },
    servers: [{ url: `http://localhost:${port}` }],
};

const options = {
    swaggerDefinition,
    apis: ["../src/routes/*.js"], // Caminho para as rotas
};

const swaggerSpec = (0, swagger_jsdoc_1.default)(options);

// Middleware para CORS
app_1.default.use((0, cors_1.default)({
    origin: 'http://localhost:3001', // Permitir apenas essa origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    credentials: true, // Se necessário para enviar cookies/credenciais
}));

// Middleware para tratamento de erros
app_1.default.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Rota de documentação do Swagger
app_1.default.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));

// Rota para servir o JSON da especificação OpenAPI
app_1.default.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Inicializa o servidor
app_1.default.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});
