const express = require('express');
const router = express.Router();
const EstabelecimentoController = require('../controllers/EstabelecimentoController');

router.post('/estabelecimentos', EstabelecimentoController.createEstabelecimento);
router.put('/estabelecimentos/:id', EstabelecimentoController.updateEstabelecimento);
router.delete('/estabelecimentos/:id', EstabelecimentoController.deleteEstabelecimento);
router.get('/estabelecimentos/:id', EstabelecimentoController.getEstabelecimento);
router.put('/estabelecimentos/:id/sabores/:saborId/disponibilidade', EstabelecimentoController.toggleDisponibilidadeSabor);
router.post('/estabelecimentos/:id/entregadores/:entregadorId/aprovar', EstabelecimentoController.aprovarEntregador);

module.exports = router;