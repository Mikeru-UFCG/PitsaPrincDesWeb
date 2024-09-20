const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Função auxiliar para gerar tokens JWT
const generateToken = (estabelecimento) => {
  return jwt.sign({ id: estabelecimento.id, nome: estabelecimento.nome }, 'SECRET_KEY', { expiresIn: '1h' });
};

// Cria um novo estabelecimento
exports.createEstabelecimento = async (req, res) => {
  const { nome, codigoAcesso, senha } = req.body;
  try {
    const existingEstabelecimento = await prisma.estabelecimento.findUnique({
      where: { nome },
    });

    if (existingEstabelecimento) {
      return res.status(400).json({ error: 'Estabelecimento já existe' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const estabelecimento = await prisma.estabelecimento.create({
      data: {
        nome,
        codigoAcesso,
        senha: hashedPassword,
      },
    });

    const token = generateToken(estabelecimento);
    res.status(201).json({ estabelecimento, token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar estabelecimento' });
  }
};

// Atualiza um estabelecimento pelo ID
exports.updateEstabelecimento = async (req, res) => {
  const { id } = req.params;
  const { nome, codigoAcesso } = req.body;

  try {
    const estabelecimento = await prisma.estabelecimento.update({
      where: { id: parseInt(id) },
      data: { nome, codigoAcesso },
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

// Altera a disponibilidade de um sabor no cardápio do estabelecimento
exports.toggleDisponibilidadeSabor = async (req, res) => {
  const { id, saborId } = req.params;

  try {
    const estabelecimento = await prisma.estabelecimento.update({
      where: { id: parseInt(id) },
      data: {
        sabores: {
          update: {
            where: { id: parseInt(saborId) },
            data: { disponibilidade: { toggle: true } },
          },
        },
      },
    });

    res.status(200).json(estabelecimento);
  } catch (error) {
    res.status(404).json({ error: 'Estabelecimento ou sabor não encontrado' });
  }
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
exports.createEstabelecimento = async (req, res) => {
  const { nome, codigoAcesso, senha } = req.body;

  try {
    // Verifica se o estabelecimento já existe
    const existingEstabelecimento = await prisma.estabelecimento.findUnique({
      where: { nome },
    });

    if (existingEstabelecimento) {
      return res.status(400).json({ error: 'Estabelecimento já existe' });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria um novo estabelecimento
    const estabelecimento = await prisma.estabelecimento.create({
      data: {
        nome,
        codigoAcesso,
        senha: hashedPassword,
      },
    });

    // Gera um token para o novo estabelecimento
    const token = generateToken(estabelecimento);

    res.status(201).json({
      estabelecimento: {
        id: estabelecimento.id,
        nome: estabelecimento.nome,
        codigoAcesso: estabelecimento.codigoAcesso,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar estabelecimento' });
  }
};


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
