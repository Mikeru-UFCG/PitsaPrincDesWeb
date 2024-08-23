const express = require('express');
const router = express.Router();
const SaborController = require('../controllers/SaborController');

/**
 * @swagger
 * tags:
 *   name: Sabores
 *   description: API para gerenciamento de sabores de pizza
 */

/**
 * @swagger
 * /sabores:
 *   post:
 *     summary: Cria um novo sabor de pizza
 *     tags: [Sabores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do sabor
 *               tipo:
 *                 type: string
 *                 enum: [salgado, doce]
 *                 description: Tipo de sabor
 *               valorM:
 *                 type: number
 *                 format: float
 *                 description: Valor do sabor para pizza média
 *               valorG:
 *                 type: number
 *                 format: float
 *                 description: Valor do sabor para pizza grande
 *             required:
 *               - nome
 *               - tipo
 *               - valorM
 *               - valorG
 *     responses:
 *       201:
 *         description: Sabor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sabor'
 *       400:
 *         description: Dados inválidos fornecidos
 */
router.post('/sabores', SaborController.createSabor);

/**
 * @swagger
 * /sabores/{id}:
 *   put:
 *     summary: Atualiza um sabor existente
 *     tags: [Sabores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do sabor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do sabor
 *               tipo:
 *                 type: string
 *                 enum: [salgado, doce]
 *                 description: Tipo de sabor
 *               valorM:
 *                 type: number
 *                 format: float
 *                 description: Valor do sabor para pizza média
 *               valorG:
 *                 type: number
 *                 format: float
 *                 description: Valor do sabor para pizza grande
 *             required:
 *               - nome
 *               - tipo
 *               - valorM
 *               - valorG
 *     responses:
 *       200:
 *         description: Sabor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sabor'
 *       404:
 *         description: Sabor não encontrado
 *       400:
 *         description: Dados inválidos fornecidos
 */
router.put('/sabores/:id', SaborController.updateSabor);

/**
 * @swagger
 * /sabores/{id}:
 *   delete:
 *     summary: Remove um sabor de pizza
 *     tags: [Sabores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do sabor
 *     responses:
 *       200:
 *         description: Sabor removido com sucesso
 *       404:
 *         description: Sabor não encontrado
 */
router.delete('/sabores/:id', SaborController.deleteSabor);

/**
 * @swagger
 * /sabores:
 *   get:
 *     summary: Retorna todos os sabores de pizza
 *     tags: [Sabores]
 *     responses:
 *       200:
 *         description: Lista de sabores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sabor'
 */
router.get('/sabores', SaborController.getSabores);

module.exports = router;
