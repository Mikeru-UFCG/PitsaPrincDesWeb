const { PrismaClient } = require('@prisma/client');
const ClienteController = require('../controllers/ClienteController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock do Prisma Client
jest.mock('@prisma/client', () => {
  const prismaMock = {
    cliente: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => prismaMock) };
});

const prisma = new PrismaClient();

describe('ClienteController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

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

  // Testando o método de login
  describe('login', () => {
    it('deve fazer login com sucesso e retornar um token', async () => {
      const clienteMock = {
        id: 1,
        nome: 'João',
        senha: 'hashedPassword',
      };

      // Mock do prisma para buscar cliente
      prisma.cliente.findUnique.mockResolvedValue(clienteMock);
      
      // Mock do bcrypt para comparar a senha
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      // Mock do jwt para gerar o token
      jwt.sign = jest.fn().mockReturnValue('fake-jwt-token');

      const req = { body: { nome: 'João', senha: 'senha123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.login(req, res);

      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { nome: 'João' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('senha123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, 'SECRET_KEY', { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        cliente: clienteMock,
        token: 'fake-jwt-token',
      });
    });

    it('deve retornar um erro quando o cliente não for encontrado', async () => {
      prisma.cliente.findUnique.mockResolvedValue(null);

      const req = { body: { nome: 'João', senha: 'senha123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClienteController.login(req, res);

      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { nome: 'João' } });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome ou senha incorretos' });
    });
  });
});
