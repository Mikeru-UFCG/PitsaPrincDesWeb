const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class EstabelecimentoController {
  // Método para criar um novo estabelecimento
  static async createEstabelecimento(req, res) {
    const { nome, codigoAcesso } = req.body;

    if (!nome || !codigoAcesso) {
      return res.status(400).json({ error: 'Nome e código de acesso são obrigatórios' });
    }

    try {
      // Verifica se o estabelecimento já existe
      const existingEstabelecimento = await prisma.estabelecimento.findUnique({
        where: { nome }
      });

      if (existingEstabelecimento) {
        return res.status(400).json({ error: 'Estabelecimento já existe' });
      }

      const estabelecimento = await prisma.estabelecimento.create({
        data: { nome, codigoAcesso },
      });

      // Gera um token JWT
      const token = jwt.sign({ id: estabelecimento.id, role: 'estabelecimento', nome }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '1h' });

      res.status(201).json({ estabelecimento, token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar estabelecimento' });
    }
  }

  // Método para atualizar um estabelecimento
  static async updateEstabelecimento(req, res) {
    try {
      const { id } = req.params;
      const estabelecimento = await prisma.estabelecimento.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(200).json(estabelecimento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar estabelecimento' });
    }
  }

  // Método para excluir um estabelecimento
  static async deleteEstabelecimento(req, res) {
    try {
      const { id } = req.params;
      await prisma.estabelecimento.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir estabelecimento' });
    }
  }

  // Método para obter um estabelecimento
  static async getEstabelecimento(req, res) {
    try {
      const { id } = req.params;
      const estabelecimento = await prisma.estabelecimento.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(estabelecimento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter estabelecimento' });
    }
  }

  // Método para alterar a disponibilidade de um sabor
  static async toggleDisponibilidadeSabor(req, res) {
    try {
      const { saborId } = req.params;
      const sabor = await prisma.sabor.update({
        where: { id: parseInt(saborId) },
        data: { disponivel: req.body.disponivel },
      });
      res.status(200).json(sabor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao modificar disponibilidade do sabor' });
    }
  }

  // Método para aprovar um entregador
  static async aprovarEntregador(req, res) {
    try {
      const { entregadorId } = req.params;
      const entregador = await prisma.entregador.update({
        where: { id: parseInt(entregadorId) },
        data: { aprovado: req.body.aprovado },
      });
      res.status(200).json(entregador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao aprovar entregador' });
    }
  }

  // Método para autenticar um estabelecimento
  static async loginEstabelecimento(req, res) {
    const { nome, codigoAcesso } = req.body;

    if (!nome || !codigoAcesso) {
      return res.status(400).json({ error: 'Nome e código de acesso são obrigatórios' });
    }

    try {
      const estabelecimento = await prisma.estabelecimento.findUnique({
        where: { nome, codigoAcesso }
      });

      if (!estabelecimento) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gera um token JWT
      const token = jwt.sign({ id: estabelecimento.id, role: 'estabelecimento', nome }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '1h' });

      res.status(200).json({ message: 'Autenticação bem-sucedida', token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao autenticar estabelecimento' });
    }
  }

  // Método para obter uma lista de estabelecimentos com paginação
static async getEstabelecimentos(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Página atual
    const limit = parseInt(req.query.limit) || 10; // Itens por página
    const skip = (page - 1) * limit;

    // Busca os estabelecimentos com paginação
    const estabelecimentos = await prisma.estabelecimento.findMany({
      skip: skip,
      take: limit,
    });

    // Conta o total de estabelecimentos
    const totalEstabelecimentos = await prisma.estabelecimento.count();

    res.status(200).json({
      data: estabelecimentos,
      meta: {
        total: totalEstabelecimentos,
        page,
        pages: Math.ceil(totalEstabelecimentos / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estabelecimentos' });
  }
}

}

module.exports = EstabelecimentoController;
