const express = require('express');
const router = express.Router();
const SaborController = require('../controllers/SaborController');

router.post('/sabores', SaborController.createSabor);
router.put('/sabores/:id', SaborController.updateSabor);
router.delete('/sabores/:id', SaborController.deleteSabor);
router.get('/sabores', SaborController.getSabores);

module.exports = router;