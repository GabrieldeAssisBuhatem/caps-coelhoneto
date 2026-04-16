const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
  
router.post('/usuarios/registrar', usuarioController.registrarUsuario);

router.post('/usuarios/login', usuarioController.loginUsuario);

module.exports = router;