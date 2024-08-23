const express = require('express');
const router = express.Router();
const EstabelecimentoController = require('../controllers/EstabelecimentoController');

/**
 * @swagger
 * tags:
 *   name: Estabelecimentos
 *   description: API para gerenciamento de estabelecimentos
 */

/**
 * @swagger
 * /estabelecimentos:
 *   post:
 *     summary: Cria um novo estabelecimento
 *     tags: [Estabelecimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estabelecimento'
 *     responses:
 *       201:
 *         description: Estabelecimento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/estabelecimentos', EstabelecimentoController.createEstabelecimento);

/**
 * @swagger
 * /estabelecimentos/{id}:
 *   put:
 *     summary: Atualiza um estabelecimento pelo ID
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do estabelecimento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estabelecimento'
 *     responses:
 *       200:
 *         description: Estabelecimento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Estabelecimento não encontrado
 */
router.put('/estabelecimentos/:id', EstabelecimentoController.updateEstabelecimento);

/**
 * @swagger
 * /estabelecimentos/{id}:
 *   delete:
 *     summary: Remove um estabelecimento pelo ID
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do estabelecimento
 *     responses:
 *       204:
 *         description: Estabelecimento removido com sucesso
 *       404:
 *         description: Estabelecimento não encontrado
 */
router.delete('/estabelecimentos/:id', EstabelecimentoController.deleteEstabelecimento);

/**
 * @swagger
 * /estabelecimentos/{id}:
 *   get:
 *     summary: Retorna os detalhes de um estabelecimento pelo ID
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do estabelecimento
 *     responses:
 *       200:
 *         description: Detalhes do estabelecimento encontrados
 *       404:
 *         description: Estabelecimento não encontrado
 */
router.get('/estabelecimentos/:id', EstabelecimentoController.getEstabelecimento);

/**
 * @swagger
 * /estabelecimentos/{id}/sabores/{saborId}/disponibilidade:
 *   put:
 *     summary: Altera a disponibilidade de um sabor no cardápio do estabelecimento
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do estabelecimento
 *       - in: path
 *         name: saborId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do sabor
 *     responses:
 *       200:
 *         description: Disponibilidade do sabor alterada com sucesso
 *       404:
 *         description: Estabelecimento ou sabor não encontrado
 */
router.put('/estabelecimentos/:id/sabores/:saborId/disponibilidade', EstabelecimentoController.toggleDisponibilidadeSabor);

/**
 * @swagger
 * /estabelecimentos/{id}/entregadores/{entregadorId}/aprovar:
 *   post:
 *     summary: Aprova um entregador para realizar entregas para o estabelecimento
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do estabelecimento
 *       - in: path
 *         name: entregadorId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do entregador
 *     responses:
 *       200:
 *         description: Entregador aprovado com sucesso
 *       404:
 *         description: Estabelecimento ou entregador não encontrado
 */
router.post('/estabelecimentos/:id/entregadores/:entregadorId/aprovar', EstabelecimentoController.aprovarEntregador);

module.exports = router;
