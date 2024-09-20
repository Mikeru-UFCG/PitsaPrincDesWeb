const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const entregadorMock = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      entregador: entregadorMock,
    })),
  };
});

const EntregadorController = require('../controllers/EntregadorController'); // Ajuste o caminho conforme necessário
const prisma = new PrismaClient();


describe('EntregadorController', () => {
  let prisma;

  beforeAll(() => {
    prisma = new PrismaClient(); // Cria uma instância mockada do PrismaClient
  });

  describe('createEntregador', () => {
    it('deve criar um novo entregador com sucesso', async () => {
      const req = {
        body: { nome: 'Novo Entregador' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const entregador = { id: 1, ...req.body };
      prisma.entregador.create.mockResolvedValue(entregador); // Certifique-se de que `create` está mockado corretamente
  
      await EntregadorController.createEntregador(req, res);
  
      expect(prisma.entregador.create).toHaveBeenCalledWith({
        data: req.body,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(entregador);
    });
  
    it('deve retornar um erro ao falhar na criação do entregador', async () => {
      const req = {
        body: { nome: 'Novo Entregador' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      prisma.entregador.create.mockRejectedValue(new Error('Erro ao criar entregador')); // Certifique-se de que `create` está mockado corretamente
  
      await EntregadorController.createEntregador(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar entregador' });
    });
  });
  

  describe('updateEntregador', () => {
    it('deve atualizar o entregador com sucesso', async () => {
      const req = {
        params: { id: '1' },
        user: { id: 1 },
        body: {
          nome: 'Entregador Atualizado',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno da atualização do entregador
      const entregador = { id: 1, nome: 'Entregador Atualizado' };
      prisma.entregador.update.mockResolvedValue(entregador);

      await EntregadorController.updateEntregador(req, res);

      expect(prisma.entregador.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: req.body,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(entregador);
    });

    it('deve retornar erro de acesso negado ao tentar atualizar outro entregador', async () => {
      const req = {
        params: { id: '2' },
        user: { id: 1 },
        body: {
          nome: 'Entregador Atualizado',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await EntregadorController.updateEntregador(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
    });

    it('deve retornar um erro ao falhar na atualização do entregador', async () => {
      const req = {
        params: { id: '1' },
        user: { id: 1 },
        body: {
          nome: 'Entregador Atualizado',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock da falha na atualização do entregador
      prisma.entregador.update.mockRejectedValue(new Error('Erro ao atualizar entregador'));

      await EntregadorController.updateEntregador(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar entregador' });
    });
  });

  it('deve deletar o entregador com sucesso', async () => {
    const req = {
      params: { id: '1' },
      user: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  
    prisma.entregador.delete.mockResolvedValue({}); // Mock da deleção do entregador
  
    await EntregadorController.deleteEntregador(req, res);
  
    expect(prisma.entregador.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  describe('definirDisponibilidade', () => {
    it('deve definir a disponibilidade do entregador com sucesso', async () => {
      const req = {
        params: { id: '1' },
        user: { id: 1 },
        body: { disponivel: true },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock do retorno da atualização do entregador
      const entregador = { id: 1, disponivel: true };
      prisma.entregador.update.mockResolvedValue(entregador);

      await EntregadorController.definirDisponibilidade(req, res);

      expect(prisma.entregador.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { disponivel: req.body.disponivel },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(entregador);
    });

    it('deve retornar erro de acesso negado ao tentar alterar a disponibilidade de outro entregador', async () => {
      const req = {
        params: { id: '2' },
        user: { id: 1 },
        body: { disponivel: true },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await EntregadorController.definirDisponibilidade(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
    });

    it('deve retornar um erro ao falhar na definição da disponibilidade', async () => {
      const req = {
        params: { id: '1' },
        user: { id: 1 },
        body: { disponivel: true },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock da falha na atualização da disponibilidade
      prisma.entregador.update.mockRejectedValue(new Error('Erro ao definir disponibilidade'));

      await EntregadorController.definirDisponibilidade(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao definir disponibilidade' });
    });
  });

  describe('getEntregadores', () => {
    it('deve retornar a lista de entregadores com sucesso', async () => {
      const req = {
        query: { page: '1', limit: '10' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock dos dados dos entregadores
      const entregadores = [{ id: 1, nome: 'Entregador 1' }, { id: 2, nome: 'Entregador 2' }];
      prisma.entregador.findMany.mockResolvedValue(entregadores);
      prisma.entregador.count.mockResolvedValue(20); // Total de entregadores

      await EntregadorController.getEntregadores(req, res);

      expect(prisma.entregador.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(prisma.entregador.count).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: entregadores,
        meta: {
          total: 20,
          page: 1,
          pages: 2,
        },
      });
    });

    it('deve retornar a lista de entregadores com valores padrão de paginação', async () => {
      const req = {
        query: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock dos dados dos entregadores
      const entregadores = [{ id: 1, nome: 'Entregador 1' }];
      prisma.entregador.findMany.mockResolvedValue(entregadores);
      prisma.entregador.count.mockResolvedValue(5); // Total de entregadores

      await EntregadorController.getEntregadores(req, res);

      expect(prisma.entregador.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: entregadores,
        meta: {
          total: 5,
          page: 1,
          pages: 1,
        },
      });
    });

    it('deve retornar um erro ao falhar ao obter entregadores', async () => {
      const req = {
        query: { page: '1', limit: '10' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock da falha ao buscar entregadores
      prisma.entregador.findMany.mockRejectedValue(new Error('Erro ao obter entregadores'));

      await EntregadorController.getEntregadores(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter entregadores' });
    });
  });
});
