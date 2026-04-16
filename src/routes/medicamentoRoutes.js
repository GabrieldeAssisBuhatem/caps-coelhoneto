const express = require('express');
const router = express.Router();
const medController = require('../controllers/medicamentoController');
const { validateMedicamento } = require('../Validators/MedicamentoValidator');
const { protegerRota } = require('../middleware/authMiddleware');

router.use(protegerRota);

router.post('/medicamentos', validateMedicamento, medController.create);
router.get('/medicamentos', medController.getAll);
router.put('/medicamentos/:id', validateMedicamento, medController.update);
router.delete('/medicamentos/:id', medController.remove);

module.exports = router;