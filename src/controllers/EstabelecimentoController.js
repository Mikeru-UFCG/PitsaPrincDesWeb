const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EstabelecimentoController {
  static async createEstabelecimento(req, res) {
    try {
      const estabelecimento = await prisma.estabelecimento.create({
        data: req.body,
      });
      res.status(201).json(estabelecimento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar estabelecimento' });
    }
  }

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

  static async toggleDisponibilidadeSabor(req, res) {
    try {
      const { id, saborId } = req.params;
      const sabor = await prisma.sabor.update({
        where: { id: parseInt(saborId) },
        data: { disponivel: req.body.disponivel },
      });
      res.status(200).json(sabor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao modificar disponibilidade do sabor' });
    }
  }

  static async aprovarEntregador(req, res) {
    try {
      const { id, entregadorId } = req.params;
      const entregador = await prisma.entregador.update({
        where: { id: parseInt(entregadorId) },
        data: { aprovado: req.body.aprovado },
      });
      res.status(200).json(entregador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao aprovar entregador' });
    }
  }
}

module.exports = EstabelecimentoController;
