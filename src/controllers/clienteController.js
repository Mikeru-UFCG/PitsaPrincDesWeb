const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ClienteController {
  static async createCliente(req, res) {
    try {
      const cliente = await prisma.cliente.create({
        data: req.body,
      });
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }

  static async updateCliente(req, res) {
    try {
      const { id } = req.params;
      const cliente = await prisma.cliente.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }

  static async deleteCliente(req, res) {
    try {
      const { id } = req.params;
      await prisma.cliente.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
  }

  static async getCliente(req, res) {
    try {
      const { id } = req.params;
      const cliente = await prisma.cliente.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cliente' });
    }
  }

  static async getCardapio(req, res) {
    try {
      const { id } = req.params;
      const sabores = await prisma.sabor.findMany({
        where: { estabelecimentoId: parseInt(id) },
        orderBy: { disponivel: 'desc' }, // Sabores disponíveis primeiro
      });
      res.status(200).json(sabores);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cardápio' });
    }
  }

  static async interesseSabor(req, res) {
    try {
      const { id, saborId } = req.params;
      const interesse = await prisma.interesse.create({
        data: {
          clienteId: parseInt(id),
          saborId: parseInt(saborId),
        },
      });
      res.status(201).json(interesse);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar interesse' });
    }
  }

  static async criarPedido(req, res) {
    try {
      const pedido = await prisma.pedido.create({
        data: {
          clienteId: parseInt(req.params.id),
          ...req.body,
        },
      });
      res.status(201).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }

  static async confirmarPagamento(req, res) {
    try {
      const { id, pedidoId } = req.params;
      const pedido = await prisma.pedido.update({
        where: { id: parseInt(pedidoId) },
        data: { status: 'Pedido em preparo' }, // Atualiza o status
      });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao confirmar pagamento' });
    }
  }

  static async cancelarPedido(req, res) {
    try {
      const { id, pedidoId } = req.params;
      const pedido = await prisma.pedido.delete({
        where: {
          id: parseInt(pedidoId),
          clienteId: parseInt(id),
        },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cancelar pedido' });
    }
  }

  static async verHistoricoPedidos(req, res) {
    try {
      const { id } = req.params;
      const pedidos = await prisma.pedido.findMany({
        where: { clienteId: parseInt(id) },
        orderBy: [
          { status: 'asc' }, // Pedidos não entregues primeiro
          { createdAt: 'desc' }, // Pedidos mais recentes primeiro
        ],
      });
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter histórico de pedidos' });
    }
  }

  static async confirmarEntrega(req, res) {
    try {
      const { id, pedidoId } = req.params;
      const pedido = await prisma.pedido.update({
        where: {
          id: parseInt(pedidoId),
          clienteId: parseInt(id),
        },
        data: { status: 'Pedido entregue' }, // Atualiza o status
      });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao confirmar entrega' });
    }
  }
}

module.exports = ClienteController;