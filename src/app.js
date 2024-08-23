// src/app.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Importação das rotas
const estabelecimentoRoutes = require('./routes/estabelecimentoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const entregadorRoutes = require('./routes/entregadorRoutes');
const saborRoutes = require('./routes/saborRoutes');  // Corrigido para minúscula
const entregaRoutes = require('./routes/entregaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');
// Importe outras rotas conforme necessário

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware para parsing de JSON

// Middleware para injetar o Prisma Client nas requisições
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Registro das rotas
app.use('/estabelecimentos', estabelecimentoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/entregadores', entregadorRoutes);
app.use('/sabores', saborRoutes);  // Certifique-se de que o nome do arquivo e a importação estejam corretos
app.use('/entregas', entregaRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/notificacoes', notificacaoRoutes);
// Adicione outras rotas conforme necessário

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

module.exports = app;
