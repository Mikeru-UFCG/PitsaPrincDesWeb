const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class ClienteController {
  static async createCliente(req, res) {
    try {
      // As ações de criação de cliente devem ser protegidas e apenas permitidas para administradores
      // O middleware de autenticação deve estar em uso aqui
      const cliente = await prisma.cliente.create({
        data: req.body,
      });
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }

  static async getCliente(req, res) {
    try {
      const { id } = req.params;
  
      // Verifica se o cliente está tentando acessar seu próprio perfil
      if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
  
      const cliente = await prisma.cliente.findUnique({
        where: { id: parseInt(id) },
      });
  
      // Verifica se o cliente foi encontrado
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
  
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cliente' });
    }
  }

  static async updateCliente(req, res) {
    try {
      const { id } = req.params;
      
      // Verifica se o cliente está tentando atualizar seu próprio perfil
      if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
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

      // Verifica se o cliente está tentando deletar seu próprio perfil
      if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      await prisma.cliente.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir cliente' });
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
          clienteId: parseInt(req.user.id), // Usa o ID do cliente autenticado
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
      const { pedidoId } = req.params;
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
      const { pedidoId } = req.params;
      const pedido = await prisma.pedido.delete({
        where: {
          id: parseInt(pedidoId),
          clienteId: parseInt(req.user.id), // Usa o ID do cliente autenticado
        },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cancelar pedido' });
    }
  }

  static async verHistoricoPedidos(req, res) {
    try {
      // Obtém parâmetros de consulta para paginação
      const page = parseInt(req.query.page) || 1; // Página atual
      const limit = parseInt(req.query.limit) || 10; // Itens por página
      const skip = (page - 1) * limit; // Número de itens a pular
  
      // Obtém os pedidos com paginação
      const pedidos = await prisma.pedido.findMany({
        where: { clienteId: parseInt(req.user.id) }, // Usa o ID do cliente autenticado
        skip: skip,
        take: limit,
        orderBy: [
          { status: 'asc' }, // Pedidos não entregues primeiro
          { createdAt: 'desc' }, // Pedidos mais recentes primeiro
        ],
      });
  
      // Conta o total de pedidos para fornecer informações sobre a paginação
      const totalPedidos = await prisma.pedido.count({
        where: { clienteId: parseInt(req.user.id) }, // Conta apenas os pedidos do cliente autenticado
      });
  
      res.status(200).json({
        data: pedidos,
        meta: {
          total: totalPedidos,
          page,
          pages: Math.ceil(totalPedidos / limit), // Calcula o número total de páginas
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter histórico de pedidos' });
    }
  }  

  static async confirmarEntrega(req, res) {
    try {
      const { pedidoId } = req.params;
      const pedido = await prisma.pedido.update({
        where: {
          id: parseInt(pedidoId),
          clienteId: parseInt(req.user.id), // Usa o ID do cliente autenticado
        },
        data: { status: 'Pedido entregue' }, // Atualiza o status
      });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao confirmar entrega' });
    }
  }

  static async register(req, res) {
    try {
        const { nome, codigoAcesso, endereco } = req.body;

        // Verifica se o cliente já existe
        const existingClient = await prisma.cliente.findUnique({
            where: { nome }
        });
        if (existingClient) {
            return res.status(400).json({ error: 'Cliente já existe' });
        }

        // Cria um hash do código de acesso
        const hashedPassword = await bcrypt.hash(codigoAcesso, 10);

        // Cria o novo cliente
        const cliente = await prisma.cliente.create({
            data: { nome, codigoAcesso: hashedPassword, endereco },
        });

        // Gera um token JWT
        const token = jwt.sign({ id: cliente.id }, 'SECRET_KEY', { expiresIn: '1h' });

        res.status(201).json({ cliente, token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar cliente' });
    }
}

static async login(req, res) {
    try {
        const { nome, codigoAcesso } = req.body;

        // Busca o cliente
        const cliente = await prisma.cliente.findUnique({
            where: { nome }
        });

        if (!cliente || !(await bcrypt.compare(codigoAcesso, cliente.codigoAcesso))) {
            return res.status(401).json({ error: 'Nome ou código de acesso incorretos' });
        }

        // Gera um token JWT
        const token = jwt.sign({ id: cliente.id }, 'SECRET_KEY', { expiresIn: '1h' });

        res.status(200).json({ cliente, token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
}

module.exports = ClienteController;
