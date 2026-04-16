const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const pacienteValidator = require('../validators/pacienteValidator');
const { protegerRota } = require('../middleware/authMiddleware');

router.get('/pacientes/:id', protegerRota, pacienteController.getPacienteById);
router.get('/pacientes', protegerRota, pacienteController.getAllPacientes);
router.delete('/pacientes/:id', protegerRota, pacienteController.deletePaciente);

router.post(
    '/pacientes',
    protegerRota,
    pacienteValidator.validatePaciente,
    pacienteController.createPaciente
);

router.put(
    '/pacientes/:id',
    protegerRota,
    pacienteValidator.validatePaciente,
    pacienteController.updatePaciente
);
router.get('/unidades', protegerRota, pacienteController.getAllUnidades);

module.exports = router;