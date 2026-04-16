// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protegerRota = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Verifica se o token existe
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // 3. Tenta verificar o token com a chave secreta
    try {
        const decodificado = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );
        
        req.usuario = decodificado;
        next(); // Se o token for válido, continua
    } catch (error) {
        // Se o token for inválido ou expirado, retorna erro
        res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = {
    protegerRota
};