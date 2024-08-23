const express = require('express');
const router = express.Router();
const EntregaController = require('../controllers/EntregaController');

router.put('/entregas/:id/atribuir', EntregaController.atribuirEntrega);
router.get('/entregas/:id', EntregaController.getEntrega);

module.exports = router;