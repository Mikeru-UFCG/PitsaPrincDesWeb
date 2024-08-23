// src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrinDesWebPizza API',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos de pizza, clientes, entregadores e estabelecimentos.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL base da sua API
      },
    ],
    components: {
      schemas: {
        Cliente: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID do cliente',
            },
            nome: {
              type: 'string',
              description: 'Nome completo do cliente',
            },
            endereco: {
              type: 'string',
              description: 'Endereço principal do cliente',
            },
            codigoAcesso: {
              type: 'string',
              description: 'Código de acesso ao sistema (6 dígitos)',
            },
          },
          required: ['nome', 'endereco', 'codigoAcesso'],
        },
        Entregador: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID do entregador',
            },
            nome: {
              type: 'string',
              description: 'Nome completo do entregador',
            },
            placaVeiculo: {
              type: 'string',
              description: 'Placa do veículo do entregador',
            },
            tipoVeiculo: {
              type: 'string',
              enum: ['moto', 'carro'],
              description: 'Tipo do veículo (moto ou carro)',
            },
            corVeiculo: {
              type: 'string',
              description: 'Cor do veículo do entregador',
            },
            codigoAcesso: {
              type: 'string',
              description: 'Código de acesso ao sistema (6 dígitos)',
            },
            disponibilidade: {
              type: 'string',
              enum: ['Ativo', 'Descanso'],
              description: 'Disponibilidade do entregador',
            },
          },
          required: ['nome', 'placaVeiculo', 'tipoVeiculo', 'corVeiculo', 'codigoAcesso'],
        },
        Estabelecimento: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID do estabelecimento',
            },
            nome: {
              type: 'string',
              description: 'Nome do estabelecimento',
            },
            codigoAcesso: {
              type: 'string',
              description: 'Código de acesso ao sistema (6 dígitos)',
            },
          },
          required: ['nome', 'codigoAcesso'],
        },
        Notificacao: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID da notificação',
            },
            mensagem: {
              type: 'string',
              description: 'Mensagem da notificação',
            },
            clienteId: {
              type: 'integer',
              format: 'int64',
              description: 'ID do cliente que recebeu a notificação',
            },
            estabelecimentoId: {
              type: 'integer',
              format: 'int64',
              description: 'ID do estabelecimento que gerou a notificação',
            },
          },
          required: ['mensagem'],
        },
        Pedido: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID do pedido',
            },
            clienteId: {
              type: 'integer',
              format: 'int64',
              description: 'ID do cliente que fez o pedido',
            },
            enderecoEntrega: {
              type: 'string',
              description: 'Endereço de entrega do pedido',
            },
            valorTotal: {
              type: 'number',
              format: 'float',
              description: 'Valor total do pedido',
            },
            status: {
              type: 'string',
              enum: ['Pedido recebido', 'Pedido em preparo', 'Pedido pronto', 'Pedido em rota', 'Pedido entregue'],
              description: 'Status atual do pedido',
            },
            entregadorId: {
              type: 'integer',
              format: 'int64',
              description: 'ID do entregador atribuído ao pedido',
            },
          },
          required: ['clienteId', 'valorTotal', 'status'],
        },
        Sabor: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID do sabor',
            },
            nome: {
              type: 'string',
              description: 'Nome do sabor',
            },
            tipo: {
              type: 'string',
              enum: ['salgado', 'doce'],
              description: 'Tipo do sabor',
            },
            valorM: {
              type: 'number',
              format: 'float',
              description: 'Valor do sabor para pizza média',
            },
            valorG: {
              type: 'number',
              format: 'float',
              description: 'Valor do sabor para pizza grande',
            },
            disponibilidade: {
              type: 'boolean',
              description: 'Disponibilidade do sabor',
            },
          },
          required: ['nome', 'tipo', 'valorM', 'valorG'],
        },
        Entrega: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID da entrega',
            },
            pedidoId: {
              type: 'integer',
              format: 'int64',
              description: 'ID do pedido associado à entrega',
            },
            entregadorId: {
              type: 'integer',
              format: 'int64',
              description: 'ID do entregador responsável pela entrega',
            },
            status: {
              type: 'string',
              enum: ['ATRIBUIDO', 'EM_ROTA', 'CONCLUIDO'],
              description: 'Status atual da entrega',
            },
          },
          required: ['pedidoId', 'status'],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Localização dos arquivos de rotas
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
