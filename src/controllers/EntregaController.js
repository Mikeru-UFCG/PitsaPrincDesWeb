const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EntregaController {
  static async atribuirEntrega(req, res) {
    try {
      const { id } = req.params;
      const entrega = await prisma.entrega.update({
        where: { id: parseInt(id) },
        data: {
          entregadorId: req.body.entregadorId,
        },
      });
      res.status(200).json(entrega);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atribuir entrega' });
    }
  }

  static async getEntrega(req, res) {
    try {
      const { id } = req.params;
      const entrega = await prisma.entrega.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(entrega);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter entrega' });
    }
  }
}

module.exports = EntregaController;
