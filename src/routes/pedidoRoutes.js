const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

router.get('/pedidos/:id', PedidoController.getPedido);
router.put('/pedidos/:id/status', PedidoController.updateStatusPedido);

module.exports = router;