const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.post('/clientes', ClienteController.createCliente);
router.put('/clientes/:id', ClienteController.updateCliente);
router.delete('/clientes/:id', ClienteController.deleteCliente);
router.get('/clientes/:id', ClienteController.getCliente);
router.get('/clientes/:id/cardapio', ClienteController.getCardapio);
router.post('/clientes/:id/pedidos', ClienteController.criarPedido);
router.put('/clientes/:id/pedidos/:pedidoId/pagamento', ClienteController.confirmarPagamento);
router.delete('/clientes/:id/pedidos/:pedidoId', ClienteController.cancelarPedido);
router.get('/clientes/:id/historico-pedidos', ClienteController.verHistoricoPedidos);
router.put('/clientes/:id/pedidos/:pedidoId/confirmar-entrega', ClienteController.confirmarEntrega);

module.exports = router;
