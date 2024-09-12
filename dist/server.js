"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc")); // Import Swagger JSDoc
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express")); // Import Swagger UI

const app = (0, express_1.default)();
const port = 3000;

// Configurações do Swagger
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "PrinDesWebPizza API",
        version: "1.0.0",
        description: "API para gerenciamento de pedidos de pizza, clientes, entregadores e estabelecimentos.",
    },
    servers: [{ url: `http://localhost:${port}` }],
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js"], // Caminho para as rotas
};

const swaggerSpec = (0, swagger_jsdoc_1.default)(options);

app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Rota de documentação do Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));

// Rota para servir o JSON da especificação OpenAPI
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});
