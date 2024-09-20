const { PrismaClient } = require('@prisma/client');
const EstabelecimentoController = require('../controllers/EstabelecimentoController');
const prisma = new PrismaClient();
jest.mock('@prisma/client'); // Mock do Prisma Client

describe('EstabelecimentoController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  beforeAll(() => {
    // Mock Prisma Client methods
    PrismaClient.prototype.estabelecimento = {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    };
  });

  // Métodos de teste executados a seguir:

  describe('createEstabelecimento', () => {
    it('Deve criar um novo estabelecimento e retornar um token JWT', async () => {
      req.body = {
        nome: 'estabelecimentoTeste',
        codigoAcesso: '123456',
        senha: 'senha123',
      };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue(null); // Nenhum estabelecimento encontrado
      PrismaClient.prototype.estabelecimento.create.mockResolvedValue({
        id: 1,
        nome: 'estabelecimentoTeste',
        codigoAcesso: '123456',
      });

      await EstabelecimentoController.createEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { nome: 'estabelecimentoTeste' },
      });
      expect(PrismaClient.prototype.estabelecimento.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        estabelecimento: expect.any(Object),
        token: expect.any(String),
      }));
    });

    it('Deve retornar erro se o estabelecimento já existir', async () => {
      req.body = {
        nome: 'estabelecimentoTeste',
        codigoAcesso: '123456',
        senha: 'senha123',
      };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue({
        id: 1,
        nome: 'estabelecimentoTeste',
      });

      await EstabelecimentoController.createEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { nome: 'estabelecimentoTeste' },
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento já existe' });
    });
  });

  describe('updateEstabelecimento', () => {
    it('Deve atualizar um estabelecimento pelo ID', async () => {
      req.params = { id: '1' };
      req.body = { nome: 'estabelecimentoAtualizado', codigoAcesso: '654321' };

      PrismaClient.prototype.estabelecimento.update.mockResolvedValue({
        id: 1,
        nome: 'estabelecimentoAtualizado',
        codigoAcesso: '654321',
      });

      await EstabelecimentoController.updateEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'estabelecimentoAtualizado', codigoAcesso: '654321' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'estabelecimentoAtualizado',
        codigoAcesso: '654321',
      });
    });

    it('Deve retornar erro se o estabelecimento não for encontrado', async () => {
      req.params = { id: '1' };
      req.body = { nome: 'estabelecimentoAtualizado', codigoAcesso: '654321' };

      PrismaClient.prototype.estabelecimento.update.mockRejectedValue({ code: 'P2025' });

      await EstabelecimentoController.updateEstabelecimento(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento não encontrado' });
    });
  });

  describe('deleteEstabelecimento', () => {
    it('Deve remover um estabelecimento pelo ID', async () => {
      req.params = { id: '1' };

      PrismaClient.prototype.estabelecimento.delete.mockResolvedValue({});

      await EstabelecimentoController.deleteEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('Deve retornar erro se o estabelecimento não for encontrado', async () => {
      req.params = { id: '1' };

      PrismaClient.prototype.estabelecimento.delete.mockRejectedValue({ code: 'P2025' });

      await EstabelecimentoController.deleteEstabelecimento(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento não encontrado' });
    });
  });

  describe('getEstabelecimento', () => {
    it('Deve retornar os detalhes de um estabelecimento pelo ID', async () => {
      req.params = { id: '1' };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue({
        id: 1,
        nome: 'estabelecimentoTeste',
        codigoAcesso: '123456',
      });

      await EstabelecimentoController.getEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'estabelecimentoTeste',
        codigoAcesso: '123456',
      });
    });

    it('Deve retornar erro se o estabelecimento não for encontrado', async () => {
      req.params = { id: '1' };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue(null);

      await EstabelecimentoController.getEstabelecimento(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento não encontrado' });
    });
  });

  describe('getEstabelecimentos', () => {
    it('deve retornar uma lista de estabelecimentos com sucesso', async () => {
      req.query = { page: 1, limit: 10 };
      const estabelecimentosMock = [{ id: 1, nome: 'Estabelecimento 1' }];
      const totalMock = 1;

      PrismaClient.prototype.estabelecimento.findMany.mockResolvedValue(estabelecimentosMock);
      PrismaClient.prototype.estabelecimento.count.mockResolvedValue(totalMock);

      await EstabelecimentoController.getEstabelecimentos(req, res);

      expect(PrismaClient.prototype.estabelecimento.findMany).toHaveBeenCalledWith({
        skip: 0, // (1 - 1) * 10
        take: 10,
      });
      expect(PrismaClient.prototype.estabelecimento.count).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: estabelecimentosMock,
        meta: {
          total: totalMock,
          page: 1,
          pages: 1,
        },
      });
    });

    it('deve retornar erro ao falhar ao obter estabelecimentos', async () => {
      req.query = { page: 1, limit: 10 };
      PrismaClient.prototype.estabelecimento.findMany.mockRejectedValue(new Error('Erro ao obter estabelecimentos'));

      await EstabelecimentoController.getEstabelecimentos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter estabelecimentos' });
    });

    it('deve utilizar valores padrão de paginação se não forem fornecidos', async () => {
      req.query = {}; // Nenhum parâmetro de paginação fornecido
      const estabelecimentosMock = [{ id: 1, nome: 'Estabelecimento 1' }];
      const totalMock = 1;

      PrismaClient.prototype.estabelecimento.findMany.mockResolvedValue(estabelecimentosMock);
      PrismaClient.prototype.estabelecimento.count.mockResolvedValue(totalMock);

      await EstabelecimentoController.getEstabelecimentos(req, res);

      expect(PrismaClient.prototype.estabelecimento.findMany).toHaveBeenCalledWith({
        skip: 0, // (1 - 1) * 10
        take: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: estabelecimentosMock,
        meta: {
          total: totalMock,
          page: 1,
          pages: 1,
        },
      });
    });
  });

  describe('toggleDisponibilidadeSabor', () => {
    it('Deve alterar a disponibilidade de um sabor no cardápio do estabelecimento', async () => {
      req.params = { id: '1', saborId: '2' };

      PrismaClient.prototype.estabelecimento.update.mockResolvedValue({
        id: 1,
        sabores: [{ id: 2, disponibilidade: true }],
      });

      await EstabelecimentoController.toggleDisponibilidadeSabor(req, res);

      expect(PrismaClient.prototype.estabelecimento.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          sabores: {
            update: {
              where: { id: 2 },
              data: { disponibilidade: { toggle: true } },
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        sabores: [{ id: 2, disponibilidade: true }],
      });
    });

    it('Deve retornar erro se o estabelecimento ou sabor não for encontrado', async () => {
      req.params = { id: '1', saborId: '2' };

      PrismaClient.prototype.estabelecimento.update.mockRejectedValue({ code: 'P2025' });

      await EstabelecimentoController.toggleDisponibilidadeSabor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento ou sabor não encontrado' });
    });
  });

  describe('aprovarEntregador', () => {
    it('Deve aprovar um entregador para realizar entregas para o estabelecimento', async () => {
      req.params = { id: '1', entregadorId: '2' };

      PrismaClient.prototype.estabelecimento.update.mockResolvedValue({
        id: 1,
        entregadores: [{ id: 2 }],
      });

      await EstabelecimentoController.aprovarEntregador(req, res);

      expect(PrismaClient.prototype.estabelecimento.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          entregadores: {
            connect: { id: 2 },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        entregadores: [{ id: 2 }],
      });
    });

    it('Deve retornar erro se o estabelecimento ou entregador não for encontrado', async () => {
      req.params = { id: '1', entregadorId: '2' };

      PrismaClient.prototype.estabelecimento.update.mockRejectedValue({ code: 'P2025' });

      await EstabelecimentoController.aprovarEntregador(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento ou entregador não encontrado' });
    });
  });

  describe('login', () => {
    it('Deve autenticar um estabelecimento com nome e código de acesso', async () => {
      req.body = { nome: 'estabelecimentoTeste', codigoAcesso: '123456' };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue({
        id: 1,
        nome: 'estabelecimentoTeste',
        codigoAcesso: '123456',
      });

      await EstabelecimentoController.loginEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { nome: 'estabelecimentoTeste' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
    });

    it('Deve retornar erro se as credenciais forem inválidas', async () => {
      req.body = { nome: 'estabelecimentoTeste', codigoAcesso: '123456' };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue(null);

      await EstabelecimentoController.loginEstabelecimento(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });
  });

  describe('register', () => {
    it('deve registrar um novo estabelecimento com sucesso', async () => {
      req.body = {
        nome: 'Estabelecimento Teste',
        codigoAcesso: '123456',
        senha: 'senha123',
      };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue(null); // Nenhum estabelecimento encontrado
      PrismaClient.prototype.estabelecimento.create.mockResolvedValue({
        id: 1,
        nome: 'Estabelecimento Teste',
        codigoAcesso: '123456',
      });

      await EstabelecimentoController.createEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { nome: 'Estabelecimento Teste' },
      });
      expect(PrismaClient.prototype.estabelecimento.create).toHaveBeenCalledWith({
        data: {
          nome: 'Estabelecimento Teste',
          codigoAcesso: '123456',
          senha: expect.any(String), // O hash da senha será gerado
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        estabelecimento: expect.any(Object),
        token: expect.any(String),
      }));
    });

    it('deve retornar erro se o estabelecimento já existir', async () => {
      req.body = {
        nome: 'Estabelecimento Teste',
        codigoAcesso: '123456',
        senha: 'senha123',
      };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue({
        id: 1,
        nome: 'Estabelecimento Teste',
      });

      await EstabelecimentoController.createEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { nome: 'Estabelecimento Teste' },
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento já existe' });
    });

    it('deve retornar erro ao falhar na criação do estabelecimento', async () => {
      req.body = {
        nome: 'Estabelecimento Teste',
        codigoAcesso: '123456',
        senha: 'senha123',
      };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue(null); // Nenhum estabelecimento encontrado
      PrismaClient.prototype.estabelecimento.create.mockRejectedValue(new Error('Erro ao criar estabelecimento'));

      await EstabelecimentoController.createEstabelecimento(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar estabelecimento' });
    });
  });
});
