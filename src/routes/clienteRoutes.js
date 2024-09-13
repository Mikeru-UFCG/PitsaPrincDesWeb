const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: API para gerenciamento de clientes
 */

/**
 * @swagger
 * /clientes/register:
 *   post:
 *     summary: Registra um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/clientes/register', ClienteController.register);

/**
 * @swagger
 * /clientes/login:
 *   post:
 *     summary: Faz login de um cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Nome ou senha incorretos
 */
router.post('/clientes/login', ClienteController.login);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/clientes', authMiddleware(['estabelecimento']), ClienteController.createCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/clientes/:id', authMiddleware(['cliente']), ClienteController.updateCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Remove um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       204:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/clientes/:id', authMiddleware(['cliente']), ClienteController.deleteCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/clientes/:id', authMiddleware(['cliente']), ClienteController.getCliente);

/**
 * @swagger
 * /clientes/{id}/cardapio:
 *   get:
 *     summary: Retorna o cardápio disponível para o cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cardápio retornado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/clientes/:id/cardapio', authMiddleware(['cliente']), ClienteController.getCardapio);

/**
 * @swagger
 * /clientes/{id}/pedidos:
 *   post:
 *     summary: Cria um novo pedido para o cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/clientes/:id/pedidos', authMiddleware(['cliente']), ClienteController.criarPedido);

/**
 * @swagger
 * /clientes/{id}/pedidos/{pedidoId}/pagamento:
 *   put:
 *     summary: Confirma o pagamento de um pedido
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metodoPagamento:
 *                 type: string
 *                 description: Método de pagamento (Cartão de crédito, débito ou Pix)
 *     responses:
 *       200:
 *         description: Pagamento confirmado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente ou pedido não encontrado
 */
router.put('/clientes/:id/pedidos/:pedidoId/pagamento', authMiddleware(['cliente']), ClienteController.confirmarPagamento);

/**
 * @swagger
 * /clientes/{id}/pedidos/{pedidoId}:
 *   delete:
 *     summary: Cancela um pedido
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       204:
 *         description: Pedido cancelado com sucesso
 *       404:
 *         description: Cliente ou pedido não encontrado
 */
router.delete('/clientes/:id/pedidos/:pedidoId', authMiddleware(['cliente']), ClienteController.cancelarPedido);

/**
 * @swagger
 * /clientes/{id}/historico-pedidos:
 *   get:
 *     summary: Retorna o histórico de pedidos do cliente com paginação
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página a ser retornada
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Histórico de pedidos retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Número total de pedidos
 *                 pedidos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/clientes/:id/historico-pedidos', authMiddleware(['cliente']), ClienteController.verHistoricoPedidos);


/**
 * @swagger
 * /clientes/{id}/pedidos/{pedidoId}/confirmar-entrega:
 *   put:
 *     summary: Confirma a entrega de um pedido
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Entrega confirmada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente ou pedido não encontrado
 */
router.put('/clientes/:id/pedidos/:pedidoId/confirmar-entrega', authMiddleware(['cliente']), ClienteController.confirmarEntrega);

module.exports = router;
