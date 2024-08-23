const express = require('express');
const router = express.Router();
const EntregaController = require('../controllers/EntregaController');

/**
 * @swagger
 * tags:
 *   name: Entregas
 *   description: API para gerenciamento de entregas
 */

/**
 * @swagger
 * /entregas/{id}/atribuir:
 *   put:
 *     summary: Atribui uma entrega a um entregador
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entregadorId:
 *                 type: integer
 *                 description: ID do entregador que será atribuído à entrega
 *     responses:
 *       200:
 *         description: Entrega atribuída com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Entrega não encontrada
 *       409:
 *         description: Conflito ao atribuir a entrega
 */
router.put('/entregas/:id/atribuir', EntregaController.atribuirEntrega);

/**
 * @swagger
 * /entregas/{id}:
 *   get:
 *     summary: Retorna os detalhes de uma entrega pelo ID
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da entrega
 *     responses:
 *       200:
 *         description: Detalhes da entrega encontrados
 *       404:
 *         description: Entrega não encontrada
 */
router.get('/entregas/:id', EntregaController.getEntrega);

module.exports = router;
