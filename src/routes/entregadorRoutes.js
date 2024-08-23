const express = require('express');
const router = express.Router();
const EntregadorController = require('../controllers/EntregadorController');

router.post('/entregadores', EntregadorController.createEntregador);
router.put('/entregadores/:id', EntregadorController.updateEntregador);
router.delete('/entregadores/:id', EntregadorController.deleteEntregador);
router.get('/entregadores/:id', EntregadorController.getEntregador);
router.put('/entregadores/:id/disponibilidade', EntregadorController.definirDisponibilidade);

module.exports = router;