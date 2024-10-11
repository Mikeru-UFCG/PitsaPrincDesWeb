const request = require('supertest');
const app = require('../src/app.js'); // Importar o app Express
const { prisma } = require('@prisma/client'); // Caso precise mockar interações com o banco de dados

describe('Estabelecimento Routes', () => {

  // Teste para a criação de um estabelecimento
  describe('POST /estabelecimentos', () => {
    it('deve criar um novo estabelecimento e retornar 201', async () => {
      const response = await request(app)
        .post('/estabelecimentos')
        .send({
          nome: 'Pizzaria do Teste',
          codigoAcesso: '123456',
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('deve retornar 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/estabelecimentos')
        .send({
          nome: '', // Nome inválido
          codigoAcesso: '123',
        });
      expect(response.statusCode).toBe(400);
    });
  });
});