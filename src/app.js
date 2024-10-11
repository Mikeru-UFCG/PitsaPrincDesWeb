const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { swaggerUi, specs } = require('./swagger'); // Importa o Swagger
const cors = require('cors'); // Importa o middleware CORS

// Importação das rotas
const estabelecimentoRoutes = require('./routes/estabelecimentoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const entregadorRoutes = require('./routes/entregadorRoutes');
const saborRoutes = require('./routes/saborRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware para parsing de JSON

// Configura o CORS para permitir requisições do front-end em localhost:3001
app.use(cors({
  origin: 'http://localhost:3001', // Permitir apenas essa origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  credentials: true, // Se necessário para enviar cookies/credenciais
}));

// Middleware para injetar o Prisma Client nas requisições
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Registro das rotas
app.use(express.json());
app.use('/estabelecimentos', estabelecimentoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/entregadores', entregadorRoutes);
app.use('/sabores', saborRoutes);
app.use('/entregas', entregaRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/notificacoes', notificacaoRoutes);

// Configura o Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rota para obter a especificação OpenAPI em formato JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Rota de inicialização
app.get('/', (req, res) => {
  res.send('PWD Pizzas, a sua plataforma de delivery de pizzas!');
});

module.exports = app;
