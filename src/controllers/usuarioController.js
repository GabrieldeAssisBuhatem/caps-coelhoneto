// src/controllers/usuarioController.js

const usuarioService = require('../services/usuarioService');

/**
 * Gerencia o registro de um novo usuário.
 */
const registrarUsuario = async (req, res) => {
    try {
        const novoUsuario = await usuarioService.registrarUsuario(req.body);
        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            usuario: novoUsuario
        });
    } catch (error) {
        console.error("Erro no controller ao registrar usuário:", error);
        // Retorna um erro específico se o e-mail já existir
        if (error.message === 'Este Email já está em uso.') {
            return res.status(409).json({ message: error.message });
        }
        // Retorna um erro genérico para outras falhas
        res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
    }
};

/**
 * Gerencia o login de um usuário e retorna um token JWT.
 */
const loginUsuario = async (req, res) => {
    try {
        const { token } = await usuarioService.loginUsuario(req.body);
        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        // Retorna um erro específico para credenciais inválidas
        if (error.message === 'CPF ou senha inválidos.') {
            return res.status(401).json({ message: error.message });
        }
        // Retorna um erro genérico para outras falhas
        console.error("Erro no controller ao fazer login:", error);
        res.status(500).json({ message: 'Erro interno ao fazer login.' });
    }
};

// Exporta as funções para serem usadas pelo arquivo de rotas
module.exports = {
    registrarUsuario,
    loginUsuario
};