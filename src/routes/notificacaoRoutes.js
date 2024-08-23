const express = require('express');
const router = express.Router();
const NotificacaoController = require('../controllers/NotificacaoController');

/**
 * @swagger
 * tags:
 *   name: Notificações
 *   description: API para gerenciamento de notificações
 */

/**
 * @swagger
 * /clientes/{id}/notificacoes:
 *   get:
 *     summary: Retorna todas as notificações de um cliente pelo ID
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Notificações do cliente encontradas com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/clientes/:id/notificacoes', NotificacaoController.getNotificacoesCliente);

/**
 * @swagger
 * /estabelecimentos/{id}/notificacoes:
 *   get:
 *     summary: Retorna todas as notificações de um estabelecimento pelo ID
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do estabelecimento
 *     responses:
 *       200:
 *         description: Notificações do estabelecimento encontradas com sucesso
 *       404:
 *         description: Estabelecimento não encontrado
 */
router.get('/estabelecimentos/:id/notificacoes', NotificacaoController.getNotificacoesEstabelecimento);

module.exports = router;
