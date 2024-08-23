const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificacaoController {
  static async getNotificacoesCliente(req, res) {
    try {
      const { id } = req.params;
      const notificacoes = await prisma.notificacao.findMany({
        where: { clienteId: parseInt(id) },
      });
      res.status(200).json(notificacoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter notificações do cliente' });
    }
  }

  static async getNotificacoesEstabelecimento(req, res) {
    try {
      const { id } = req.params;
      const notificacoes = await prisma.notificacao.findMany({
        where: { estabelecimentoId: parseInt(id) },
      });
      res.status(200).json(notificacoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter notificações do estabelecimento' });
    }
  }
}

module.exports = NotificacaoController;
