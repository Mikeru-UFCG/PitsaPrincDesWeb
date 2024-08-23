const express = require('express');
const router = express.Router();
const NotificacaoController = require('../controllers/NotificacaoController');

router.get('/clientes/:id/notificacoes', NotificacaoController.getNotificacoesCliente);
router.get('/estabelecimentos/:id/notificacoes', NotificacaoController.getNotificacoesEstabelecimento);

module.exports = router;