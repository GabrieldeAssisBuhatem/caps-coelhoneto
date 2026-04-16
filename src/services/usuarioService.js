const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// src/services/usuarioService.js

const registrarUsuario = async (dadosUsuario) => {
    // Agora esperamos também o CPF
    const { nome, email, senha, cpf } = dadosUsuario;

    // Verifica se o email OU o CPF já estão em uso
    const [usuariosExistentes] = await db.execute('SELECT id FROM usuarios WHERE email = ? OR cpf = ?', [email, cpf]);
    if (usuariosExistentes.length > 0) {
        throw new Error('Email ou CPF já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);
    
    // Adicionamos o CPF no comando INSERT
    const sql = 'INSERT INTO usuarios (nome, email, senha_hash, cpf) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(sql, [nome, email, senha_hash, cpf]);

    return { id: result.insertId, nome, email };
};

const loginUsuario = async (dadosLogin) => {
    // Agora esperamos o CPF em vez do email
    const { cpf, senha } = dadosLogin;

    // A busca agora é feita pelo CPF
    const sqlBusca = 'SELECT * FROM usuarios WHERE cpf = ?';
    const [usuarios] = await db.execute(sqlBusca, [cpf]);
    const usuarioEncontrado = usuarios[0];

    if (!usuarioEncontrado) {
        throw new Error('CPF ou senha inválidos.');
    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha_hash);

    if (!senhaCorreta) {
        throw new Error('CPF ou senha inválidos.');
    }

    const payload = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '8h' }
    );

    return { token };
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    // (Mantenha as outras funções de get/update se você as tiver)
};