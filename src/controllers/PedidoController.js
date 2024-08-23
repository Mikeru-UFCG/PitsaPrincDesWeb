const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PedidoController {
  static async getPedido(req, res) {
    try {
      const { id } = req.params;
      const pedido = await prisma.pedido.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter pedido' });
    }
  }

  static async updateStatusPedido(req, res) {
    try {
      const { id } = req.params;
      const pedido = await prisma.pedido.update({
        where: { id: parseInt(id) },
        data: { status: req.body.status },
      });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
  }
}

module.exports = PedidoController;
