// src/middleware/authMiddleware.js

const Estabelecimento = require('../models/Estabelecimento');

const authenticateEstabelecimento = async (req, res, next) => {
  const { nome, codigoAcesso } = req.headers;

  if (!nome || !codigoAcesso) {
    return res.status(401).json({ error: 'Nome e código de acesso são obrigatórios' });
  }

  try {
    const estabelecimento = await Estabelecimento.findOne({ nome, codigoAcesso });

    if (!estabelecimento) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    req.estabelecimento = estabelecimento; // Adiciona o estabelecimento autenticado à requisição
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = authenticateEstabelecimento;
