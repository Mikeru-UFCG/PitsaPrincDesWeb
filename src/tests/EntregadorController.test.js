// src/tests/EntregadorController.test.js

// Importações
const { PrismaClient } = require('@prisma/client');
const EntregadorController = require('../controllers/EntregadorController');
const prisma = new PrismaClient();
jest.mock('@prisma/client'); // Mock do Prisma Client

describe('EntregadorController - register', () => {
  let req, res;

  beforeEach(() => {
    // Mock de req e res
    req = {
      body: {
        nome: 'entregadorTeste',
        senha: 'senha123',
        placaVeiculo: 'XYZ-1234',
        tipoVeiculo: 'carro',
        corVeiculo: 'preto',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  beforeAll(() => {
    // Mock Prisma Client methods
    PrismaClient.prototype.entregador = {
      findUnique: jest.fn(),
      create: jest.fn(),
    };
  });

  it('Deve registrar um novo entregador e retornar um token JWT', async () => {
    // Mock prisma findUnique e create
    PrismaClient.prototype.entregador.findUnique.mockResolvedValue(null); // Nenhum entregador encontrado
    PrismaClient.prototype.entregador.create.mockResolvedValue({
      id: 1,
      nome: 'entregadorTeste',
      placaVeiculo: 'XYZ-1234',
      tipoVeiculo: 'carro',
      corVeiculo: 'preto',
    });

    await EntregadorController.register(req, res);

    expect(PrismaClient.prototype.entregador.findUnique).toHaveBeenCalledWith({
      where: { nome: 'entregadorTeste' },
    });
    expect(PrismaClient.prototype.entregador.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      entregador: expect.any(Object),
      token: expect.any(String),
    }));
  });

  it('Deve retornar erro se o entregador já existir', async () => {
    // Mock findUnique para retornar um entregador existente
    PrismaClient.prototype.entregador.findUnique.mockResolvedValue({
      id: 1,
      nome: 'entregadorTeste',
    });

    await EntregadorController.register(req, res);

    expect(PrismaClient.prototype.entregador.findUnique).toHaveBeenCalledWith({
      where: { nome: 'entregadorTeste' },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Entregador já existe' });
  });
});

describe('EntregadorController - getEntregadores', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        query: {
          page: '1',
          limit: '10',
        },
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
    });
  
    beforeAll(() => {
      // Mock Prisma Client methods
      PrismaClient.prototype.entregador = {
        findMany: jest.fn(),
        count: jest.fn(),
      };
    });
  
    it('Deve retornar uma lista paginada de entregadores', async () => {
      // Mock Prisma findMany e count
      PrismaClient.prototype.entregador.findMany.mockResolvedValue([
        { id: 1, nome: 'entregador1' },
        { id: 2, nome: 'entregador2' },
      ]);
      PrismaClient.prototype.entregador.count.mockResolvedValue(20);
  
      await EntregadorController.getEntregadores(req, res);
  
      expect(PrismaClient.prototype.entregador.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(PrismaClient.prototype.entregador.count).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { id: 1, nome: 'entregador1' },
          { id: 2, nome: 'entregador2' },
        ],
        meta: {
          total: 20,
          page: 1,
          pages: 2,
        },
      });
    });
  
    it('Deve retornar erro ao falhar na busca de entregadores', async () => {
      // Mock prisma findMany para lançar um erro
      PrismaClient.prototype.entregador.findMany.mockRejectedValue(new Error('Erro ao obter entregadores'));
  
      await EntregadorController.getEntregadores(req, res);
  
      expect(PrismaClient.prototype.entregador.findMany).toHaveBeenCalled();
      expect(PrismaClient.prototype.entregador.count).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter entregadores' });
    });


  });
  
