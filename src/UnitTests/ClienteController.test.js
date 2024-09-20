const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock do Prisma Client
jest.mock('@prisma/client', () => {
  const prismaMock = {
    cliente: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    sabor: {
      findMany: jest.fn(),
    },
    interesse: {
      create: jest.fn(),
    },
    pedido: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => prismaMock) };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const ClienteController = require('../controllers/ClienteController'); // Ajuste o caminho conforme necessário
const prisma = new PrismaClient();

describe('ClienteController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  // Métodos de teste executados a seguir:

  // Testando o método de criação de cliente
  describe('createCliente', () => {
    it('deve criar um novo cliente com sucesso', async () => {
      // Mock do prisma para simular a criação de cliente
      prisma.cliente.create.mockResolvedValue({
        id: 1,
        nome: 'João',
        endereco: 'Rua ABC, 123',
      });

      // Mock da requisição e resposta
      const req = {
        body: { nome: 'João', endereco: 'Rua ABC, 123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.createCliente(req, res);

      // Verifica se o prisma criou o cliente corretamente
      expect(prisma.cliente.create).toHaveBeenCalledWith({
        data: { nome: 'João', endereco: 'Rua ABC, 123' },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'João',
        endereco: 'Rua ABC, 123',
      });
    });

    it('deve retornar um erro ao falhar na criação do cliente', async () => {
      // Simula uma falha ao criar cliente
      prisma.cliente.create.mockRejectedValue(new Error('Erro ao criar cliente'));

      const req = { body: { nome: 'João', endereco: 'Rua ABC, 123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.createCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar cliente' });
    });
  });

  // Testando o método de leitura de cliente
  describe('getCliente', () => {
    it('deve retornar um cliente com sucesso', async () => {
      // Mock do prisma para simular a busca do cliente
      prisma.cliente.findUnique.mockResolvedValue({
        id: 1,
        nome: 'João',
        endereco: 'Rua ABC, 123',
      });

      // Mock da requisição e resposta
      const req = {
        params: { id: 1 },
        user: { id: 1 }, // O cliente está tentando acessar seu próprio perfil
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.getCliente(req, res);

      // Verifica se o prisma buscou o cliente corretamente
      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'João',
        endereco: 'Rua ABC, 123',
      });
    });

    it('deve retornar um erro se o cliente não for encontrado', async () => {
      // Simula o prisma retornando null (cliente não encontrado)
      prisma.cliente.findUnique.mockResolvedValue(null);

      const req = {
        params: { id: 1 },
        user: { id: 1 }, // O cliente está tentando acessar seu próprio perfil
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.getCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Cliente não encontrado' });
    });

    it('deve retornar um erro de acesso negado se o cliente tentar acessar outro perfil', async () => {
      const req = {
        params: { id: 2 }, // Cliente está tentando acessar um perfil diferente
        user: { id: 1 }, // ID do cliente logado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.getCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
    });
  });

  describe('updateCliente', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve atualizar o cliente com sucesso', async () => {
      // Mock do prisma para simular a atualização do cliente
      prisma.cliente.update.mockResolvedValue({
        id: 1,
        nome: 'João Silva',
        endereco: 'Rua XYZ, 456',
      });

      // Mock da requisição e resposta
      const req = {
        params: { id: 1 },
        body: { nome: 'João Silva', endereco: 'Rua XYZ, 456' },
        user: { id: 1 }, // Simulando que o cliente está logado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.updateCliente(req, res);

      // Verifica se o prisma atualizou o cliente corretamente
      expect(prisma.cliente.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'João Silva', endereco: 'Rua XYZ, 456' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'João Silva',
        endereco: 'Rua XYZ, 456',
      });
    });

    it('deve retornar erro de acesso negado se o cliente tentar atualizar outro perfil', async () => {
      const req = {
        params: { id: 2 }, // Simulando que o cliente está tentando atualizar o perfil de outra pessoa
        body: { nome: 'João Silva', endereco: 'Rua XYZ, 456' },
        user: { id: 1 }, // ID do cliente logado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.updateCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
    });

    it('deve retornar um erro ao falhar na atualização do cliente', async () => {
      // Simula uma falha na atualização
      prisma.cliente.update.mockRejectedValue(new Error('Erro ao atualizar cliente'));

      const req = {
        params: { id: 1 },
        body: { nome: 'João Silva', endereco: 'Rua XYZ, 456' },
        user: { id: 1 }, // Simulando que o cliente está logado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.updateCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar cliente' });
    });

    describe('deleteCliente', () => {
      beforeEach(() => {
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks();
      });

      it('deve deletar o cliente com sucesso', async () => {
        const req = {
          params: { id: 1 },
          user: { id: 1 }, // Simulando que o cliente está logado
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          end: jest.fn(),
        };

        await ClienteController.deleteCliente(req, res);

        // Verifica se o prisma deletou o cliente corretamente
        expect(prisma.cliente.delete).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
      });

      it('deve retornar erro de acesso negado se o cliente tentar deletar outro perfil', async () => {
        const req = {
          params: { id: 2 }, // Simulando que o cliente está tentando deletar o perfil de outra pessoa
          user: { id: 1 }, // ID do cliente logado
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        await ClienteController.deleteCliente(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
      });

      it('deve retornar um erro ao falhar na exclusão do cliente', async () => {
        // Simula uma falha na exclusão
        prisma.cliente.delete.mockRejectedValue(new Error('Erro ao excluir cliente'));

        const req = {
          params: { id: 1 },
          user: { id: 1 }, // Simulando que o cliente está logado
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        await ClienteController.deleteCliente(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao excluir cliente' });
      });
    });
  });

  describe('getCardapio', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve obter o cardápio com sucesso', async () => {
      const req = {
        params: { id: 1 }, // ID do estabelecimento
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno do Prisma
      prisma.sabor.findMany.mockResolvedValue([
        { id: 1, nome: 'Margherita', disponivel: true },
        { id: 2, nome: 'Pepperoni', disponivel: true },
      ]);

      await ClienteController.getCardapio(req, res);

      expect(prisma.sabor.findMany).toHaveBeenCalledWith({
        where: { estabelecimentoId: 1 },
        orderBy: { disponivel: 'desc' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, nome: 'Margherita', disponivel: true },
        { id: 2, nome: 'Pepperoni', disponivel: true },
      ]);
    });

    it('deve retornar um erro ao falhar na obtenção do cardápio', async () => {
      const req = {
        params: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simula uma falha na busca do cardápio
      prisma.sabor.findMany.mockRejectedValue(new Error('Erro ao obter sabores'));

      await ClienteController.getCardapio(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter cardápio' });
    });
  });

  describe('interesseSabor', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve registrar o interesse com sucesso', async () => {
      const req = {
        params: { id: 1, saborId: 2 }, // ID do cliente e do sabor
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno do Prisma
      prisma.interesse.create.mockResolvedValue({
        id: 1,
        clienteId: 1,
        saborId: 2,
      });

      await ClienteController.interesseSabor(req, res);

      expect(prisma.interesse.create).toHaveBeenCalledWith({
        data: {
          clienteId: 1,
          saborId: 2,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        clienteId: 1,
        saborId: 2,
      });
    });

    it('deve retornar um erro ao falhar ao registrar o interesse', async () => {
      const req = {
        params: { id: 1, saborId: 2 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simula uma falha ao criar o interesse
      prisma.interesse.create.mockRejectedValue(new Error('Erro ao registrar interesse'));

      await ClienteController.interesseSabor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao registrar interesse' });
    });
  });

  describe('confirmarPagamento', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve confirmar o pagamento e atualizar o status do pedido', async () => {
      const req = {
        params: { pedidoId: '1' }, // ID do pedido
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno do Prisma
      prisma.pedido.update.mockResolvedValue({
        id: 1,
        status: 'Pedido em preparo',
      });

      await ClienteController.confirmarPagamento(req, res);

      expect(prisma.pedido.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'Pedido em preparo' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        status: 'Pedido em preparo',
      });
    });

    it('deve retornar um erro ao falhar na confirmação do pagamento', async () => {
      const req = {
        params: { pedidoId: '1' }, // ID do pedido
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simula uma falha na atualização do pedido
      prisma.pedido.update.mockRejectedValue(new Error('Erro ao confirmar pagamento'));

      await ClienteController.confirmarPagamento(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao confirmar pagamento' });
    });
  });

  describe('criarPedido', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve criar um pedido com sucesso', async () => {
      const req = {
        user: { id: 1 }, // ID do cliente autenticado
        body: {
          // Adicione os atributos que espera receber no corpo da requisição
          saborId: 2,
          quantidade: 1,
          endereco: 'Rua Exemplo, 123',
          metodoPagamento: 'cartão',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno do Prisma
      prisma.pedido.create.mockResolvedValue({
        id: 1,
        clienteId: 1,
        saborId: 2,
        quantidade: 1,
        endereco: 'Rua Exemplo, 123',
        metodoPagamento: 'cartão',
      });

      await ClienteController.criarPedido(req, res);

      expect(prisma.pedido.create).toHaveBeenCalledWith({
        data: {
          clienteId: 1,
          saborId: 2,
          quantidade: 1,
          endereco: 'Rua Exemplo, 123',
          metodoPagamento: 'cartão',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        clienteId: 1,
        saborId: 2,
        quantidade: 1,
        endereco: 'Rua Exemplo, 123',
        metodoPagamento: 'cartão',
      });
    });

    it('deve retornar um erro ao falhar na criação do pedido', async () => {
      const req = {
        user: { id: 1 }, // ID do cliente autenticado
        body: {
          saborId: 2,
          quantidade: 1,
          endereco: 'Rua Exemplo, 123',
          metodoPagamento: 'cartão',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simula uma falha ao criar o pedido
      prisma.pedido.create.mockRejectedValue(new Error('Erro ao criar pedido'));

      await ClienteController.criarPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar pedido' });
    });
  });

  describe('cancelarPedido', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve cancelar o pedido com sucesso', async () => {
      const req = {
        params: { pedidoId: '1' }, // ID do pedido
        user: { id: 1 }, // ID do cliente autenticado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };

      // Mock do retorno do Prisma
      prisma.pedido.delete.mockResolvedValue({}); // Simula a exclusão bem-sucedida

      await ClienteController.cancelarPedido(req, res);

      expect(prisma.pedido.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
          clienteId: 1,
        },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('deve retornar um erro ao falhar na exclusão do pedido', async () => {
      const req = {
        params: { pedidoId: '1' }, // ID do pedido
        user: { id: 1 }, // ID do cliente autenticado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simula uma falha na exclusão do pedido
      prisma.pedido.delete.mockRejectedValue(new Error('Erro ao cancelar pedido'));

      await ClienteController.cancelarPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao cancelar pedido' });
    });
  });

  describe('verHistoricoPedidos', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve retornar o histórico de pedidos com sucesso', async () => {
      const req = {
        query: { page: '1', limit: '10' }, // Parâmetros de consulta
        user: { id: 1 }, // ID do cliente autenticado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock dos retornos do Prisma
      prisma.pedido.findMany.mockResolvedValue([{ id: 1, status: 'Pedido em preparo' }]);
      prisma.pedido.count.mockResolvedValue(5); // Total de pedidos

      await ClienteController.verHistoricoPedidos(req, res);

      expect(prisma.pedido.findMany).toHaveBeenCalledWith({
        where: { clienteId: 1 },
        skip: 0, // (1 - 1) * 10
        take: 10,
        orderBy: [
          { status: 'asc' },
          { createdAt: 'desc' },
        ],
      });
      expect(prisma.pedido.count).toHaveBeenCalledWith({
        where: { clienteId: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 1, status: 'Pedido em preparo' }],
        meta: {
          total: 5,
          page: 1,
          pages: 1, // 5 / 10 = 0.5, arredondado para cima
        },
      });
    });

    it('deve retornar o histórico de pedidos na página 2', async () => {
      const req = {
        query: { page: '2', limit: '10' }, // Parâmetros de consulta
        user: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.pedido.findMany.mockResolvedValue([{ id: 11, status: 'Pedido entregue' }]);
      prisma.pedido.count.mockResolvedValue(25); // Total de pedidos

      await ClienteController.verHistoricoPedidos(req, res);

      expect(prisma.pedido.findMany).toHaveBeenCalledWith({
        where: { clienteId: 1 },
        skip: 10, // (2 - 1) * 10
        take: 10,
        orderBy: [
          { status: 'asc' },
          { createdAt: 'desc' },
        ],
      });
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 11, status: 'Pedido entregue' }],
        meta: {
          total: 25,
          page: 2,
          pages: 3, // 25 / 10 = 2.5, arredondado para cima
        },
      });
    });

    it('deve retornar um erro ao falhar ao obter o histórico de pedidos', async () => {
      const req = {
        query: { page: '1', limit: '10' },
        user: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.pedido.findMany.mockRejectedValue(new Error('Erro ao obter pedidos'));

      await ClienteController.verHistoricoPedidos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter histórico de pedidos' });
    });
  });

  describe('confirmarEntrega', () => {
    beforeEach(() => {
      // Limpa todos os mocks antes de cada teste
      jest.clearAllMocks();
    });

    it('deve confirmar a entrega de um pedido com sucesso', async () => {
      const req = {
        params: { pedidoId: '1' }, // ID do pedido
        user: { id: 1 }, // ID do cliente autenticado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno do Prisma
      prisma.pedido.update.mockResolvedValue({
        id: 1,
        status: 'Pedido entregue',
        clienteId: 1,
      });

      await ClienteController.confirmarEntrega(req, res);

      expect(prisma.pedido.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          clienteId: 1,
        },
        data: { status: 'Pedido entregue' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        status: 'Pedido entregue',
        clienteId: 1,
      });
    });

    it('deve retornar um erro se o pedido não existir ou não pertencer ao cliente', async () => {
      const req = {
        params: { pedidoId: '1' },
        user: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.pedido.update.mockRejectedValue(new Error('Pedido não encontrado'));

      await ClienteController.confirmarEntrega(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao confirmar entrega' });
    });
  });

  describe('register', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve registrar um novo cliente com sucesso', async () => {
      const req = {
        body: {
          nome: 'Cliente Teste',
          senha: 'senha123',
          endereco: 'Rua Teste, 123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do cliente existente
      prisma.cliente.findUnique.mockResolvedValue(null);

      // Mock do hash da senha
      const hashedPassword = 'hashedPassword';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      // Mock do retorno da criação do cliente
      const cliente = { id: 1, nome: 'Cliente Teste', endereco: 'Rua Teste, 123' };
      prisma.cliente.create.mockResolvedValue(cliente);

      // Mock do token JWT
      const token = 'jwtToken';
      jwt.sign.mockReturnValue(token);

      await ClienteController.register(req, res);

      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { nome: 'Cliente Teste' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(prisma.cliente.create).toHaveBeenCalledWith({
        data: { nome: 'Cliente Teste', senha: hashedPassword, endereco: 'Rua Teste, 123' },
      });
      expect(jwt.sign).toHaveBeenCalledWith({ id: cliente.id }, 'SECRET_KEY', { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ cliente, token });
    });

    it('deve retornar um erro se o cliente já existir', async () => {
      const req = {
        body: {
          nome: 'Cliente Teste',
          senha: 'senha123',
          endereco: 'Rua Teste, 123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do cliente existente
      const existingClient = { id: 1, nome: 'Cliente Teste', endereco: 'Rua Teste, 123' };
      prisma.cliente.findUnique.mockResolvedValue(existingClient);

      await ClienteController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Cliente já existe' });
    });

    it('deve retornar um erro ao falhar no registro', async () => {
      const req = {
        body: {
          nome: 'Cliente Teste',
          senha: 'senha123',
          endereco: 'Rua Teste, 123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do cliente existente
      prisma.cliente.findUnique.mockResolvedValue(null);
      prisma.cliente.create.mockRejectedValue(new Error('Erro ao criar cliente'));

      await ClienteController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao registrar cliente' });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve fazer login com sucesso', async () => {
      const req = {
        body: {
          nome: 'Cliente Teste',
          senha: 'senha123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno do cliente
      const cliente = { id: 1, nome: 'Cliente Teste', senha: 'hashedPassword' };
      prisma.cliente.findUnique.mockResolvedValue(cliente);

      // Mock da comparação da senha
      bcrypt.compare.mockResolvedValue(true);

      // Mock do token JWT
      const token = 'jwtToken';
      jwt.sign.mockReturnValue(token);

      await ClienteController.login(req, res);

      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { nome: 'Cliente Teste' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('senha123', cliente.senha);
      expect(jwt.sign).toHaveBeenCalledWith({ id: cliente.id }, 'SECRET_KEY', { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ cliente, token });
    });

    it('deve retornar erro se o nome ou senha estiverem incorretos', async () => {
      const req = {
        body: {
          nome: 'Cliente Teste',
          senha: 'senhaErrada',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno do cliente
      const cliente = { id: 1, nome: 'Cliente Teste', senha: 'hashedPassword' };
      prisma.cliente.findUnique.mockResolvedValue(cliente);

      // Mock da comparação da senha
      bcrypt.compare.mockResolvedValue(false);

      await ClienteController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome ou senha incorretos' });
    });

    it('deve retornar um erro ao falhar no login', async () => {
      const req = {
        body: {
          nome: 'Cliente Teste',
          senha: 'senha123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock da falha ao buscar cliente
      prisma.cliente.findUnique.mockRejectedValue(new Error('Erro ao buscar cliente'));

      await ClienteController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao fazer login' });
    });
  });
});
