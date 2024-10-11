const express = require('express');
const router = express.Router();
const EstabelecimentoController = require('../controllers/EstabelecimentoController');
const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autorização

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
router.post('/', EstabelecimentoController.createEstabelecimento);

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
router.put('/estabelecimentos/:id', authMiddleware(['estabelecimento']), EstabelecimentoController.updateEstabelecimento);

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
router.delete('/estabelecimentos/:id', authMiddleware(['estabelecimento']), EstabelecimentoController.deleteEstabelecimento);

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
router.get('/estabelecimentos/:id', authMiddleware(['estabelecimento']), EstabelecimentoController.getEstabelecimento);

/**
 * @swagger
 * tags:
 *   name: Estabelecimentos
 *   description: API para gerenciamento de estabelecimentos
 */

/**
 * @swagger
 * /estabelecimentos/{id}/sabores:
 *   post:
 *     summary: Adiciona um novo sabor ao cardápio do estabelecimento
 *     tags: [Estabelecimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do estabelecimento
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sabor'
 *     responses:
 *       201:
 *         description: Sabor criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/estabelecimentos/:id/sabores', authMiddleware, EstabelecimentoController.createSabor);

/**
 * @swagger
 * /estabelecimentos/{id}/sabores/{saborId}:
 *   put:
 *     summary: Atualiza as informações de um sabor no cardápio do estabelecimento
 *     tags: [Estabelecimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do estabelecimento
 *         schema:
 *           type: string
 *       - name: saborId
 *         in: path
 *         required: true
 *         description: ID do sabor a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sabor'
 *     responses:
 *       200:
 *         description: Sabor atualizado com sucesso
 *       404:
 *         description: Estabelecimento ou sabor não encontrado
 */
router.put('/estabelecimentos/:id/sabores/:saborId', authMiddleware, EstabelecimentoController.updateSabor);

/**
 * @swagger
 * /estabelecimentos/{id}/sabores/{saborId}:
 *   delete:
 *     summary: Remove um sabor do cardápio do estabelecimento
 *     tags: [Estabelecimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do estabelecimento
 *         schema:
 *           type: string
 *       - name: saborId
 *         in: path
 *         required: true
 *         description: ID do sabor a ser removido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sabor removido com sucesso
 *       404:
 *         description: Estabelecimento ou sabor não encontrado
 */
router.delete('/estabelecimentos/:id/sabores/:saborId', authMiddleware, EstabelecimentoController.deleteSabor);

/**
 * @swagger
 * /estabelecimentos/{id}/sabores:
 *   get:
 *     summary: Retorna todos os sabores do cardápio de um estabelecimento
 *     tags: [Estabelecimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do estabelecimento
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de sabores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sabor'
 *       404:
 *         description: Estabelecimento não encontrado
 */
router.get('/estabelecimentos/:id/sabores', authMiddleware, EstabelecimentoController.getSabores);

/**
 * @swagger
 * /estabelecimentos/{id}/sabores/{saborId}/disponibilidade:
 *   patch:
 *     summary: Altera a disponibilidade de um sabor no cardápio do estabelecimento
 *     tags: [Estabelecimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do estabelecimento
 *         schema:
 *           type: string
 *       - name: saborId
 *         in: path
 *         required: true
 *         description: ID do sabor
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disponibilidade:
 *                 type: boolean
 *                 description: Nova disponibilidade do sabor
 *     responses:
 *       200:
 *         description: Disponibilidade alterada com sucesso
 *       404:
 *         description: Estabelecimento ou sabor não encontrado
 */
router.patch('/estabelecimentos/:id/sabores/:saborId/disponibilidade', authMiddleware, EstabelecimentoController.toggleDisponibilidadeSabor);

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
router.post('/estabelecimentos/:id/entregadores/:entregadorId/aprovar', authMiddleware(['estabelecimento']), EstabelecimentoController.aprovarEntregador);

/**
 * @swagger
 * /estabelecimentos/login:
 *   post:
 *     summary: Autentica um estabelecimento com nome e código de acesso
 *     tags: [Estabelecimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do estabelecimento
 *               codigoAcesso:
 *                 type: string
 *                 description: Código de acesso do estabelecimento
 *             required:
 *               - nome
 *               - codigoAcesso
 *     responses:
 *       200:
 *         description: Estabelecimento autenticado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/estabelecimentos/login', EstabelecimentoController.loginEstabelecimento);

/**
 * @swagger
 * /estabelecimentos:
 *   post:
 *     summary: Registra um novo estabelecimento
 *     tags: [Estabelecimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do estabelecimento
 *               codigoAcesso:
 *                 type: string
 *                 description: Código de acesso do estabelecimento
 *               senha:
 *                 type: string
 *                 description: Senha do estabelecimento
 *             required:
 *               - nome
 *               - codigoAcesso
 *               - senha
 *     responses:
 *       201:
 *         description: Estabelecimento registrado com sucesso
 *       400:
 *         description: Estabelecimento já existe
 *       500:
 *         description: Erro ao criar estabelecimento
 */
router.post('/estabelecimentos', EstabelecimentoController.createEstabelecimento);


// Rota para obter uma lista de estabelecimentos com paginação
/**
 * @swagger
 * /estabelecimentos:
 *   get:
 *     summary: Obtém uma lista de estabelecimentos com paginação
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista de estabelecimentos paginada
 *       500:
 *         description: Erro ao obter estabelecimentos
 */
router.get('/estabelecimentos', EstabelecimentoController.getEstabelecimentos);

module.exports = router;
