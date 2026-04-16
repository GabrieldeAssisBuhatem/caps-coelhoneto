// src/app.js (Versão Simplificada para Teste Final)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const app = express();

// Use a configuração mais simples e aberta possível do CORS
app.use(cors());

// Middlewares essenciais
app.use(express.json());

// Log de requisição para sabermos que ela chegou
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('pt-BR')}] ROTA ATINGIDA: ${req.method} ${req.originalUrl}`);
    next();
});

// Nossas rotas da API
app.use('/api', usuarioRoutes);
app.use('/api', pacienteRoutes);
app.use('/api', medicamentoRoutes);

// Middleware de erro global (nossa rede de segurança)
// Adicionei error.stack para nos dar um 'mapa' ainda mais detalhado do erro
app.use((error, req, res, next) => {
    console.error('--- ERRO GLOBAL CAPTURADO ---');
    console.error(error.stack); 
    res.status(500).json({ 
        message: 'Ocorreu um erro inesperado no servidor.',
        error: error.message 
    });
});


module.exports = app;