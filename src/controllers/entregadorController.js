const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EntregadorController {
  static async createEntregador(req, res) {
    try {
      const entregador = await prisma.entregador.create({
        data: req.body,
      });
      res.status(201).json(entregador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar entregador' });
    }
  }

  static async updateEntregador(req, res) {
    try {
      const { id } = req.params;
      const entregador = await prisma.entregador.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(200).json(entregador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar entregador' });
    }
  }

  static async deleteEntregador(req, res) {
    try {
      const { id } = req.params;
      await prisma.entregador.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir entregador' });
    }
  }

  static async getEntregador(req, res) {
    try {
      const { id } = req.params;
      const entregador = await prisma.entregador.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(entregador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter entregador' });
    }
  }

  static async definirDisponibilidade(req, res) {
    try {
      const { id } = req.params;
      const entregador = await prisma.entregador.update({
        where: { id: parseInt(id) },
        data: { disponivel: req.body.disponivel },
      });
      res.status(200).json(entregador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao definir disponibilidade' });
    }
  }
}

module.exports = EntregadorController;
