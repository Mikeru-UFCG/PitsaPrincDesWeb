const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SaborController {
  static async createSabor(req, res) {
    try {
      const sabor = await prisma.sabor.create({
        data: req.body,
      });
      res.status(201).json(sabor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar sabor' });
    }
  }

  static async updateSabor(req, res) {
    try {
      const { id } = req.params;
      const sabor = await prisma.sabor.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(200).json(sabor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar sabor' });
    }
  }

  static async deleteSabor(req, res) {
    try {
      const { id } = req.params;
      await prisma.sabor.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir sabor' });
    }
  }

  static async getSabores(req, res) {
    try {
      const sabores = await prisma.sabor.findMany({
        where: { estabelecimentoId: parseInt(req.query.estabelecimentoId) },
      });
      res.status(200).json(sabores);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar sabores' });
    }
  }
}

module.exports = SaborController;