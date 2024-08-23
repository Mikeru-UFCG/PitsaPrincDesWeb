const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: API para gerenciamento de pedidos
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Retorna um pedido específico pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/pedidos/:id', PedidoController.getPedido);

/**
 * @swagger
 * /pedidos/{id}/status:
 *   put:
 *     summary: Atualiza o status de um pedido específico
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *       - in: body
 *         name: status
 *         description: Novo status do pedido
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               description: Novo status do pedido
 *               example: 'Pedido em preparo'
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       400:
 *         description: Status inválido ou formato de entrada incorreto
 */
router.put('/pedidos/:id/status', PedidoController.updateStatusPedido);

module.exports = router;
