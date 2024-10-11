const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SaborController = require('./SaborController');
const prisma = new PrismaClient();

// Função auxiliar para gerar tokens JWT
const generateToken = (estabelecimento) => {
  return jwt.sign({ id: estabelecimento.id, nome: estabelecimento.nome }, 'SECRET_KEY', { expiresIn: '1h' });
};

// Cria um novo estabelecimento
exports.createEstabelecimento = async (req, res) => {
  console.log('Requisição recebida:', req.body); // Adicione este log

  const { nome, codigoAcesso } = req.body; // Lê nome e código de acesso

  try {
    // Verifica se o estabelecimento já existe
    const existingEstabelecimento = await prisma.estabelecimento.findUnique({
      where: { nome },
    });

    if (existingEstabelecimento) {
      return res.status(400).json({ error: 'Estabelecimento já existe' });
    }

    // Criptografa o código de acesso antes de salvar
    const hashedCodigoAcesso = await bcrypt.hash(codigoAcesso, 10);

    // Cria um novo estabelecimento
    const estabelecimento = await prisma.estabelecimento.create({
      data: {
        nome,
        codigoAcesso: hashedCodigoAcesso, // Armazena o código de acesso criptografado
      },
    });

    // Gera um token para o novo estabelecimento
    const token = generateToken(estabelecimento);

    res.status(201).json({
      estabelecimento: {
        id: estabelecimento.id,
        nome: estabelecimento.nome,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao criar estabelecimento:', error);
    res.status(500).json({ error: 'Erro ao criar estabelecimento' });
  }
};

// Atualiza um estabelecimento pelo ID
exports.updateEstabelecimento = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    const estabelecimento = await prisma.estabelecimento.update({
      where: { id: parseInt(id) },
      data: { nome },
    });

    res.status(200).json(estabelecimento);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }
    res.status(400).json({ error: 'Dados inválidos' });
  }
};

// Remove um estabelecimento pelo ID
exports.deleteEstabelecimento = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.estabelecimento.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao remover estabelecimento' });
  }
};

// Retorna os detalhes de um estabelecimento pelo ID
exports.getEstabelecimento = async (req, res) => {
  const { id } = req.params;

  try {
    const estabelecimento = await prisma.estabelecimento.findUnique({
      where: { id: parseInt(id) },
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    res.status(200).json(estabelecimento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estabelecimento' });
  }
};

// Função auxiliar para verificar se o estabelecimento existe
const verificaEstabelecimentoExistente = async (estabelecimentoId) => {
  const estabelecimento = await prisma.estabelecimento.findUnique({
    where: { id: estabelecimentoId },
  });
  return estabelecimento;
};

// Métodos CRUD para Sabores
exports.createSabor = async (req, res) => {
  const { estabelecimentoId } = req.body;

  // Verifica se o estabelecimento existe usando a função auxiliar
  const estabelecimento = await verificaEstabelecimentoExistente(estabelecimentoId);

  if (!estabelecimento) {
    return res.status(404).json({ error: 'Estabelecimento não encontrado' });
  }

  // Se o estabelecimento existir, chama o método de criação de sabor
  return SaborController.createSabor(req, res);
};

exports.updateSabor = (req, res) => {
  return SaborController.updateSabor(req, res);
};

exports.deleteSabor = (req, res) => {
  return SaborController.deleteSabor(req, res);
};

exports.getSabor = (req, res) => {
  return SaborController.getSabor(req, res);
};

exports.getSabores = async (req, res) => {
  const { query = {} } = req; // Garante que query seja um objeto
  const { estabelecimentoId } = query; // Agora, podemos desestruturar estabelecimentoId com segurança

  if (!estabelecimentoId) {
    return res.status(400).json({ error: 'Estabelecimento ID é necessário' });
  }

  try {
    // Chama o método getSabores do SaborController, passando o estabelecimentoId
    return await SaborController.getSabores(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar sabores' });
  }
};

// Altera a disponibilidade de um sabor no cardápio do estabelecimento
exports.toggleDisponibilidadeSabor = (req, res) => {
  return SaborController.toggleDisponibilidadeSabor(req, res);
};

// Aprova um entregador para realizar entregas para o estabelecimento
exports.aprovarEntregador = async (req, res) => {
  const { id, entregadorId } = req.params;

  try {
    const estabelecimento = await prisma.estabelecimento.update({
      where: { id: parseInt(id) },
      data: {
        entregadores: {
          connect: { id: parseInt(entregadorId) },
        },
      },
    });

    res.status(200).json(estabelecimento);
  } catch (error) {
    res.status(404).json({ error: 'Estabelecimento ou entregador não encontrado' });
  }
};

// Registra um novo estabelecimento


// Autentica um estabelecimento com nome e código de acesso
exports.loginEstabelecimento = async (req, res) => {
  const { nome, codigoAcesso } = req.body;

  try {
    const estabelecimento = await prisma.estabelecimento.findUnique({
      where: { nome },
    });

    if (!estabelecimento || estabelecimento.codigoAcesso !== codigoAcesso) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(estabelecimento);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar estabelecimento' });
  }
};

// Obtém uma lista de estabelecimentos com paginação
exports.getEstabelecimentos = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const [estabelecimentos, total] = await Promise.all([
      prisma.estabelecimento.findMany({
        skip: (page - 1) * limit,
        take: parseInt(limit),
      }),
      prisma.estabelecimento.count(),
    ]);

    res.status(200).json({
      data: estabelecimentos,
      meta: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estabelecimentos' });
  }
};
