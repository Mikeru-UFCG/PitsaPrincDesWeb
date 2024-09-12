// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { generateToken } = require('../auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função auxiliar para encontrar um usuário
async function findUser(type, identifier) {
  // Adapte conforme o tipo de usuário
  return await prisma[type].findUnique({
    where: identifier,
  });
}

// Rotas para registro (não são necessárias senhas)
router.post('/register/estabelecimento', async (req, res) => {
  const { nome, codigoAcesso } = req.body;
  try {
    const newEstabelecimento = await prisma.estabelecimento.create({
      data: { nome, codigoAcesso },
    });
    res.status(201).json({ id: newEstabelecimento.id, nome: newEstabelecimento.nome });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar o estabelecimento' });
  }
});

router.post('/register/cliente', async (req, res) => {
  const { nome, endereco, codigoAcesso } = req.body;
  try {
    const newCliente = await prisma.cliente.create({
      data: { nome, endereco, codigoAcesso },
    });
    res.status(201).json({ id: newCliente.id, nome: newCliente.nome });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar o cliente' });
  }
});

router.post('/register/entregador', async (req, res) => {
  const { nome, placaVeiculo, tipoVeiculo, corVeiculo, codigoAcesso } = req.body;
  try {
    const newEntregador = await prisma.entregador.create({
      data: { nome, placaVeiculo, tipoVeiculo, corVeiculo, codigoAcesso },
    });
    res.status(201).json({ id: newEntregador.id, nome: newEntregador.nome });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar o entregador' });
  }
});

// Rotas para login usando código de acesso
router.post('/login/estabelecimento', async (req, res) => {
  const { codigoAcesso } = req.body;
  try {
    const user = await findUser('estabelecimento', { codigoAcesso });
    if (!user) {
      return res.status(401).json({ error: 'Código de acesso inválido' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

router.post('/login/cliente', async (req, res) => {
  const { codigoAcesso } = req.body;
  try {
    const user = await findUser('cliente', { codigoAcesso });
    if (!user) {
      return res.status(401).json({ error: 'Código de acesso inválido' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

router.post('/login/entregador', async (req, res) => {
  const { codigoAcesso } = req.body;
  try {
    const user = await findUser('entregador', { codigoAcesso });
    if (!user) {
      return res.status(401).json({ error: 'Código de acesso inválido' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

module.exports = router;
