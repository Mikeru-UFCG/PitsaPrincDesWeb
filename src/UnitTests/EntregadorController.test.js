const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock do Prisma Client
jest.mock('@prisma/client', () => {
  const entregadorMock = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(), // Mock para findUnique
  };
  const associacaoMock = {
    create: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      entregador: entregadorMock,
      associacao: associacaoMock,
    })),
  };
});

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock do jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const EntregadorController = require('../controllers/EntregadorController'); // Ajuste o caminho conforme necessário
const prisma = new PrismaClient();


describe('EntregadorController', () => {

  // Métodos de teste executados a seguir:

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

  describe('deleteEntregador', () => {
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
  });

  describe('getEntregador', () => {
    it('deve retornar os dados do entregador quando o acesso for permitido', async () => {
      const req = {
        params: { id: '1' },
        user: { id: 1 }, // O ID do entregador autenticado
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const entregador = { id: 1, nome: 'Carlos', veiculo: 'Moto' };
      prisma.entregador.findUnique.mockResolvedValue(entregador);

      await EntregadorController.getEntregador(req, res);

      expect(prisma.entregador.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(entregador);
    });

    it('deve retornar 403 quando o entregador tentar acessar os dados de outro entregador', async () => {
      const req = {
        params: { id: '2' }, // ID diferente do entregador autenticado
        user: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await EntregadorController.getEntregador(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
    });

    it('deve retornar 500 quando ocorrer um erro ao buscar o entregador', async () => {
      const req = {
        params: { id: '1' },
        user: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.entregador.findUnique.mockRejectedValue(new Error('Erro ao buscar entregador'));

      await EntregadorController.getEntregador(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter entregador' });
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

    describe('solicitarAssociacao', () => {
      it('deve solicitar associação com um estabelecimento com sucesso', async () => {
        const req = {
          body: { idEstabelecimento: 1 }, // ID do estabelecimento
          user: { id: 1 }, // ID do entregador autenticado
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        const solicitacao = { id: 1, entregadorId: req.user.id, estabelecimentosId: req.body.idEstabelecimento, status: 'PENDENTE' };
        prisma.associacao.create.mockResolvedValue(solicitacao); // Mock para a criação da solicitação
    
        await EntregadorController.solicitarAssociacao(req, res);
    
        expect(prisma.associacao.create).toHaveBeenCalledWith({
          data: {
            entregadorId: req.user.id,
            estabelecimentosId: req.body.idEstabelecimento,
            status: 'PENDENTE',
          },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(solicitacao);
      });
    
      it('deve retornar um erro ao falhar na solicitação de associação', async () => {
        const req = {
          body: { idEstabelecimento: 1 }, // ID do estabelecimento
          user: { id: 1 }, // ID do entregador autenticado
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        prisma.associacao.create.mockRejectedValue(new Error('Erro ao solicitar associação')); // Mock para erro na criação
    
        await EntregadorController.solicitarAssociacao(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao solicitar associação' });
      });
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

  describe('register', () => {
    it('deve registrar um novo entregador com sucesso', async () => {
      const req = {
        body: {
          nome: 'Novo Entregador',
          codigoAcesso: 'senha123', // Substituindo senha por codigoAcesso
          placaVeiculo: 'ABC-1234',
          tipoVeiculo: 'moto',
          corVeiculo: 'vermelho',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock do retorno de busca do entregador
      prisma.entregador.findUnique.mockResolvedValue(null);
      // Mock do hash da senha
      bcrypt.hash.mockResolvedValue('hashedPassword');
      // Mock da criação do entregador
      const entregador = { id: 1, nome: 'Novo Entregador' };
      prisma.entregador.create.mockResolvedValue(entregador);
      // Mock da geração do token
      jwt.sign = jest.fn().mockReturnValue('tokenGerado');
  
      await EntregadorController.register(req, res);
  
      expect(prisma.entregador.findUnique).toHaveBeenCalledWith({ where: { nome: 'Novo Entregador' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10); // Substituição feita
      expect(prisma.entregador.create).toHaveBeenCalledWith({
        data: {
          nome: 'Novo Entregador',
          codigoAcesso: 'hashedPassword',
          placaVeiculo: 'ABC-1234',
          tipoVeiculo: 'moto',
          corVeiculo: 'vermelho',
        },
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: entregador.id, role: 'entregador', nome: 'Novo Entregador' },
        process.env.JWT_SECRET || 'SECRET_KEY',
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ entregador, token: 'tokenGerado' });
    });
  
    it('deve retornar erro se o entregador já existir', async () => {
      const req = {
        body: {
          nome: 'Entregador Existente',
          codigoAcesso: '123456',
          placaVeiculo: 'ABC-1234',
          tipoVeiculo: 'moto',
          corVeiculo: 'vermelho',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock do retorno de busca do entregador já existente
      const existingDeliverer = { id: 1, nome: 'Entregador Existente' };
      prisma.entregador.findUnique.mockResolvedValue(existingDeliverer);
  
      await EntregadorController.register(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Entregador já existe' });
    });
  
    it('deve retornar erro ao falhar na criação do entregador', async () => {
      const req = {
        body: {
          nome: 'Novo Entregador',
          codigoAcesso: '123456',
          placaVeiculo: 'ABC-1234',
          tipoVeiculo: 'moto',
          corVeiculo: 'vermelho',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock do retorno de busca do entregador
      prisma.entregador.findUnique.mockResolvedValue(null);
      // Mock do hash da senha
      bcrypt.hash.mockResolvedValue('hashedPassword');
      // Mock da falha na criação do entregador
      prisma.entregador.create.mockRejectedValue(new Error('Erro ao criar entregador'));
  
      await EntregadorController.register(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao registrar entregador' });
    });
  });
  
  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const req = {
        body: {
          nome: 'Entregador Existente',
          codigoAcesso: '123456', // Alteração feita aqui
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock do retorno de busca do entregador
      const entregador = { id: 1, nome: 'Entregador Existente', codigoAcesso: 'hashedPassword' };
      prisma.entregador.findUnique.mockResolvedValue(entregador);
      // Mock da verificação da senha
      bcrypt.compare.mockResolvedValue(true);
      // Mock da geração do token
      jwt.sign = jest.fn().mockReturnValue('tokenGerado');
  
      await EntregadorController.login(req, res);
  
      expect(prisma.entregador.findUnique).toHaveBeenCalledWith({ where: { nome: 'Entregador Existente' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashedPassword'); // Alteração feita aqui
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: entregador.id, role: 'entregador', nome: 'Entregador Existente' },
        process.env.JWT_SECRET || 'SECRET_KEY',
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ entregador, token: 'tokenGerado' });
    });
  
    it('deve retornar erro se o nome ou código de acesso estiverem incorretos', async () => {
      const req = {
        body: {
          nome: 'Entregador Inexistente',
          codigoAcesso: 'codigoAcessoErrado',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock do retorno de busca do entregador não encontrado
      prisma.entregador.findUnique.mockResolvedValue(null);
  
      await EntregadorController.login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome ou código de acesso incorretos' });
    });
  
    it('deve retornar erro ao falhar na verificação da senha', async () => {
      const req = {
        body: {
          nome: 'Entregador Existente',
          codigoAcesso: 'codigoAcessoErrado',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock do retorno de busca do entregador
      const entregador = { id: 1, nome: 'Entregador Existente', codigoAcesso: 'hashedPassword' };
      prisma.entregador.findUnique.mockResolvedValue(entregador);
      // Mock da verificação da senha como falsa
      bcrypt.compare.mockResolvedValue(false);
  
      await EntregadorController.login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome ou código de acesso incorretos' });
    });
  
    it('deve retornar erro ao falhar no login', async () => {
      const req = {
        body: {
          nome: 'Entregador Existente',
          codigoAcesso: '123456', // Alteração feita aqui
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock do retorno de busca do entregador
      const entregador = { id: 1, nome: 'Entregador Existente', codigoAcesso: 'hashedPassword' };
      prisma.entregador.findUnique.mockResolvedValue(entregador);
      // Mock da falha na comparação da senha
      bcrypt.compare.mockRejectedValue(new Error('Erro ao comparar'));
  
      await EntregadorController.login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao fazer login' });
    });
  });
  
  

});
