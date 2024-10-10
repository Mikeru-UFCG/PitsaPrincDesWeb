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
    PrismaClient.prototype.sabor = {
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
        codigoAcesso: '123456', // Apenas nome e código de acesso
      };

      // Mock para verificar se o estabelecimento já existe (neste caso, não existe)
      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue(null);
      // Mock para criar um novo estabelecimento
      PrismaClient.prototype.estabelecimento.create.mockResolvedValue({
        id: 1,
        nome: 'estabelecimentoTeste',
        codigoAcesso: 'hashedCodigoAcesso',
      });

      await EstabelecimentoController.createEstabelecimento(req, res);

      // Verificar se o findUnique foi chamado corretamente
      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { nome: 'estabelecimentoTeste' },
      });
      // Verificar se o estabelecimento foi criado
      expect(PrismaClient.prototype.estabelecimento.create).toHaveBeenCalled();
      // Verificar se a resposta contém o status 201
      expect(res.status).toHaveBeenCalledWith(201);
      // Verificar se o JSON de resposta contém o estabelecimento e o token
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        estabelecimento: expect.any(Object),
        token: expect.any(String),
      }));
    });

    it('Deve retornar erro se o estabelecimento já existir', async () => {
      req.body = {
        nome: 'estabelecimentoTeste',
        codigoAcesso: '123456',
      };

      // Mock para verificar se o estabelecimento já existe (neste caso, existe)
      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue({
        id: 1,
        nome: 'estabelecimentoTeste',
      });

      await EstabelecimentoController.createEstabelecimento(req, res);

      // Verificar se o findUnique foi chamado corretamente
      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { nome: 'estabelecimentoTeste' },
      });
      // Verificar se o status de erro foi retornado
      expect(res.status).toHaveBeenCalledWith(400);
      // Verificar se a mensagem de erro foi retornada
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
      });

      await EstabelecimentoController.updateEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'estabelecimentoAtualizado' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'estabelecimentoAtualizado',
      });
    });

    it('Deve retornar erro se o estabelecimento não for encontrado', async () => {
      req.params = { id: '1' };
      req.body = { nome: 'estabelecimentoAtualizado' };

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
      });

      await EstabelecimentoController.getEstabelecimento(req, res);

      expect(PrismaClient.prototype.estabelecimento.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'estabelecimentoTeste',
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

  describe('Cria sabor', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('Deve criar um sabor com sucesso', async () => {
      // Mock do estabelecimento existente
      const mockEstabelecimento = {
        id: 'estab123',
        nome: 'Estabelecimento Teste',
      };

      PrismaClient.prototype.estabelecimento.findUnique.mockResolvedValue(mockEstabelecimento);

      req.body = {
        nome: 'Sabor Teste',
        tipo: 'salgado',
        valorMedio: 30,
        valorGrande: 50,
        estabelecimentoId: mockEstabelecimento.id,
      };

      // Mock da criação do sabor
      PrismaClient.prototype.sabor.create.mockResolvedValue(req.body);

      await EstabelecimentoController.createSabor(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });


    it('Deve retornar erro 404 se o estabelecimento não for encontrado', async () => {
      req.body = {
        nome: 'Sabor Teste',
        tipo: 'salgado',
        valorMedio: 30,
        valorGrande: 50,
        estabelecimentoId: 'estab123',
      };

      PrismaClient.prototype.estabelecimento.findUnique = jest.fn().mockResolvedValue(null);

      await EstabelecimentoController.createSabor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Estabelecimento não encontrado' });
    });
  });

  describe('Get sabor', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: { id: '1' }, // ID do sabor que queremos buscar
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('Deve retornar um sabor com sucesso', async () => {
      const mockSabor = {
        id: '1',
        nome: 'Sabor Teste',
        tipo: 'salgado',
        valorMedio: 30,
        valorGrande: 50,
      };

      PrismaClient.prototype.sabor.findUnique.mockResolvedValue(mockSabor);

      await EstabelecimentoController.getSabor(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSabor);
    });

    it('Deve retornar erro 404 se o sabor não for encontrado', async () => {
      PrismaClient.prototype.sabor.findUnique.mockResolvedValue(null);

      await EstabelecimentoController.getSabor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sabor não encontrado' });
    });
  });

  describe('Get sabores', () => {
  });

  describe('Atualiza sabor', () => { });

  describe('Remove sabor', () => { });

  describe('toggleDisponibilidadeSabor', () => {

    it('Deve alterar a disponibilidade de um sabor no cardápio do estabelecimento', async () => {
      // Ajuste nos parâmetros para usar estabelecimentoId e saborId
      req.params = { estabelecimentoId: '1', saborId: '2' };
      req.body = { disponibilidade: true }; // Passar o corpo da requisição com a disponibilidade desejada

      // Mock do prisma para simular a resposta esperada
      PrismaClient.prototype.estabelecimento.update.mockResolvedValue({
        id: 1,
        sabores: [{ id: 2, disponibilidade: true }],
      });

      await EstabelecimentoController.toggleDisponibilidadeSabor(req, res);

      // Verificação da chamada correta ao método prisma
      expect(PrismaClient.prototype.estabelecimento.update).toHaveBeenCalledWith({
        where: { id: '1' }, // Deve usar o estabelecimentoId
        data: {
          sabores: {
            update: {
              where: { id: '2' }, // Deve usar o saborId
              data: { disponibilidade: true }, // Usa o valor passado no req.body
            },
          },
        },
      });

      // Verificação da resposta HTTP
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        sabores: [{ id: 2, disponibilidade: true }],
      });
    });

    it('Deve retornar erro se o estabelecimento ou sabor não for encontrado', async () => {
      // Ajuste nos parâmetros
      req.params = { estabelecimentoId: '1', saborId: '2' };
      req.body = { disponibilidade: true }; // Passar o corpo da requisição

      // Simular um erro "P2025" que indica que o estabelecimento ou sabor não foi encontrado
      PrismaClient.prototype.estabelecimento.update.mockRejectedValue({ code: 'P2025' });

      await EstabelecimentoController.toggleDisponibilidadeSabor(req, res);

      // Verificação do status de erro
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sabor ou Estabelecimento não encontrado' });
    });

    it('Deve retornar erro genérico para falhas inesperadas', async () => {
      // Ajuste nos parâmetros
      req.params = { estabelecimentoId: '1', saborId: '2' };
      req.body = { disponibilidade: true };

      // Simular um erro genérico
      PrismaClient.prototype.estabelecimento.update.mockRejectedValue(new Error('Erro inesperado'));

      await EstabelecimentoController.toggleDisponibilidadeSabor(req, res);

      // Verificação do status de erro 500 para erros gerais
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao alterar a disponibilidade do sabor' });
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
  });
});
